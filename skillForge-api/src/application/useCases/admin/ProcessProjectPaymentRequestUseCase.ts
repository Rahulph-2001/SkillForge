import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { IProcessProjectPaymentRequestUseCase } from './interfaces/IProcessProjectPaymentRequestUseCase';
import { NotFoundError, ValidationError, InternalServerError } from '../../../domain/errors/AppError';
import { ProjectPaymentRequestType, ProjectPaymentRequest, ProjectPaymentRequestStatus } from '../../../domain/entities/ProjectPaymentRequest';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
import { v4 as uuidv4 } from 'uuid';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';

@injectable()
export class ProcessProjectPaymentRequestUseCase implements IProcessProjectPaymentRequestUseCase {
    constructor(
        @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IUserWalletTransactionRepository) private readonly userWalletTransactionRepository: IUserWalletTransactionRepository,
        @inject(TYPES.IDebitAdminWalletUseCase) private readonly debitAdminWalletUseCase: IDebitAdminWalletUseCase,
        @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository
    ) { }

    async execute(requestId: string, adminId: string, approved: boolean, notes?: string, overrideAction?: 'OVERRIDE_RELEASE'): Promise<void> {
        // 1. Fetch Request
        const paymentRequest = await this.paymentRequestRepository.findById(requestId);
        if (!paymentRequest) {
            throw new NotFoundError('Payment request not found');
        }

        if (!paymentRequest.isPending()) {
            throw new ValidationError('Payment request is already processed');
        }

        // 2. Fetch Project
        const project = await this.projectRepository.findById(paymentRequest.projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (overrideAction === 'OVERRIDE_RELEASE') {
            if (paymentRequest.type !== ProjectPaymentRequestType.REFUND) {
                throw new ValidationError('Override Release can only be applied to Refund requests');
            }

            // 1. Mark the original REFUND request as REJECTED (Dispute resolved in favor of Contributor)
            try {
                paymentRequest.reject(adminId, `[OVERRIDE RELEASE] ${notes || 'Admin overrode refund request to release payment.'}`);
                await this.paymentRequestRepository.update(paymentRequest);
            } catch (error: any) {
                console.error(`[ProcessPaymentRequest] Failed to reject refund request ${requestId}:`, error);
                throw new InternalServerError(`Failed to process refund rejection during override: ${error.message}`);
            }

            // 2. Create a new RELEASE request and Approve it immediately
            try {
                // Get the accepted application to find the contributor
                const acceptedApplication = await this.applicationRepository.findAcceptedByProject(project.id!);
                if (!acceptedApplication) {
                    throw new NotFoundError('No accepted application found for this project to release payment to.');
                }
                const contributorId = acceptedApplication.applicantId;

                // RELEASE logic (similar to strictly approving a release)
                // Debit Admin Wallet
                await this.debitAdminWalletUseCase.execute({
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: 'PROJECT_RELEASE',
                    referenceId: project.id!,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        recipientId: contributorId,
                        originalRefundRequestId: paymentRequest.id
                    }
                });

                // Credit Contributor
                const recipient = await this.userRepository.findById(contributorId);
                if (!recipient) {
                    throw new NotFoundError(`Contributor user ${contributorId} not found`);
                }

                const previousBalance = recipient.walletBalance;
                recipient.creditWallet(paymentRequest.amount);
                const newBalance = recipient.walletBalance;
                await this.userRepository.update(recipient);

                // Create Transaction Record for Contributor
                const transaction = UserWalletTransaction.create({
                    id: uuidv4(),
                    userId: recipient.id,
                    type: UserWalletTransactionType.PROJECT_EARNING,
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: 'PROJECT_COMPLETION',
                    referenceId: project.id,
                    description: `Payment for project: ${project.title} (Dispute Resolved by Admin)`,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        originalRefundRequestId: paymentRequest.id,
                    },
                    previousBalance,
                    newBalance,
                    status: UserWalletTransactionStatus.COMPLETED,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                await this.userWalletTransactionRepository.create(transaction);

                // Mark Project as COMPLETED
                project.markAsCompleted();

                // Create audit record for the Overridden Release
                // We create a new APPROVED Request so history shows money went out
                const releaseRequest = ProjectPaymentRequest.create({
                    id: uuidv4(),
                    projectId: project.id!,
                    type: ProjectPaymentRequestType.RELEASE,
                    amount: paymentRequest.amount,
                    requestedBy: adminId,
                    recipientId: recipient.id,
                    status: ProjectPaymentRequestStatus.APPROVED,
                    processedBy: adminId,
                    processedAt: new Date(),
                    adminNotes: `Auto-created via Dispute Resolution Override. Original Refund Request: ${paymentRequest.id}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    requesterNotes: `Override Release for Dispute Resolution`
                });
                // Since we are creating it as APPROVED, we don't need to call .approve() again unless strict checks require it.
                // Entity factory usually sets props directly.

                await this.paymentRequestRepository.create(releaseRequest);

            } catch (error: any) {
                console.error(`[ProcessPaymentRequest] Failed to execute Override Release for ${requestId}:`, error);
                throw new InternalServerError(`Failed to execute Override Release: ${error.message}`);
            }

        } else if (approved) {
            // 3. Process Approval (Standard Flow)
            try {
                // For REFUND, money goes back to Requester (Creator). 
                const targetRecipientId = paymentRequest.type === ProjectPaymentRequestType.RELEASE
                    ? paymentRequest.recipientId
                    : paymentRequest.requestedBy;

                // Note: The existing logic uses paymentRequest.recipientId. 
                // We must ensure that for REFUND, the recipientId IS the Creator.
                // Assuming ReviewProjectCompletionUseCase sets recipientId = client.id for REFUND requests.
                // If so, we can trust paymentRequest.recipientId.

                // Debit Admin Wallet
                // Using 'projectId' as reference ID for wallet transaction helps tracking
                await this.debitAdminWalletUseCase.execute({
                    amount: paymentRequest.amount,
                    currency: 'INR', // Assuming INR for now, should ideally come from project/payment
                    source: paymentRequest.type === ProjectPaymentRequestType.RELEASE ? 'PROJECT_RELEASE' : 'PROJECT_REFUND',
                    referenceId: paymentRequest.id!,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        recipientId: paymentRequest.recipientId
                    }
                });

                // Credit Recipient
                const recipient = await this.userRepository.findById(paymentRequest.recipientId);
                if (!recipient) {
                    throw new NotFoundError(`Recipient user ${paymentRequest.recipientId} not found`);
                }

                const previousBalance = recipient.walletBalance;
                recipient.creditWallet(paymentRequest.amount);
                const newBalance = recipient.walletBalance;
                await this.userRepository.update(recipient);

                // Create User Wallet Transaction Record
                const transactionType = paymentRequest.type === ProjectPaymentRequestType.RELEASE
                    ? UserWalletTransactionType.PROJECT_EARNING
                    : UserWalletTransactionType.REFUND;

                const transaction = UserWalletTransaction.create({
                    id: uuidv4(),
                    userId: paymentRequest.recipientId,
                    type: transactionType,
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: paymentRequest.type === ProjectPaymentRequestType.RELEASE ? 'PROJECT_COMPLETION' : 'PROJECT_REFUND',
                    referenceId: project.id,
                    description: paymentRequest.type === ProjectPaymentRequestType.RELEASE
                        ? `Payment for project: ${project.title}`
                        : `Refund for project: ${project.title}`,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        paymentRequestId: paymentRequest.id,
                    },
                    previousBalance,
                    newBalance,
                    status: UserWalletTransactionStatus.COMPLETED,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                await this.userWalletTransactionRepository.create(transaction);

                // Update Project Status
                if (paymentRequest.type === ProjectPaymentRequestType.RELEASE) {
                    project.markAsCompleted();
                } else {
                    project.markAsCancelled();
                }

                // Update Request Status
                paymentRequest.approve(adminId, notes);

            } catch (error: any) {
                console.error(`[ProcessPaymentRequest] Failed to process approval for ${requestId}:`, error);
                throw new InternalServerError(`Failed to process payment approval: ${error.message}`);
            }
        } else {
            // 4. Process Rejection
            // Revert project status to PENDING_COMPLETION so it can be reviewed again
            try {
                project.revertToPendingCompletion();
                paymentRequest.reject(adminId, notes);
            } catch (error: any) {
                console.error(`[ProcessPaymentRequest] Failed to process rejection for ${requestId}:`, error);
                throw new InternalServerError(`Failed to process payment rejection: ${error.message}`);
            }
        }

        // Save changes
        await this.projectRepository.update(project);
        await this.paymentRequestRepository.update(paymentRequest);
    }
}

