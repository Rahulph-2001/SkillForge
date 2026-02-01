import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { IProcessProjectPaymentRequestUseCase } from './interfaces/IProcessProjectPaymentRequestUseCase';
import { NotFoundError, ValidationError, InternalServerError } from '../../../domain/errors/AppError';
import { ProjectPaymentRequestType } from '../../../domain/entities/ProjectPaymentRequest';

@injectable()
export class ProcessProjectPaymentRequestUseCase implements IProcessProjectPaymentRequestUseCase {
    constructor(
        @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IDebitAdminWalletUseCase) private readonly debitAdminWalletUseCase: IDebitAdminWalletUseCase
    ) { }

    async execute(requestId: string, adminId: string, approved: boolean, notes?: string): Promise<void> {
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

        if (approved) {
            // 3. Process Approval
            try {
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

                recipient.creditWallet(paymentRequest.amount);
                await this.userRepository.update(recipient);

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
