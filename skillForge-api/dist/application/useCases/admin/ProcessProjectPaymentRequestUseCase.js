"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessProjectPaymentRequestUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const ProjectPaymentRequest_1 = require("../../../domain/entities/ProjectPaymentRequest");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
const uuid_1 = require("uuid");
const Notification_1 = require("../../../domain/entities/Notification");
let ProcessProjectPaymentRequestUseCase = class ProcessProjectPaymentRequestUseCase {
    constructor(paymentRequestRepository, projectRepository, userRepository, userWalletTransactionRepository, debitAdminWalletUseCase, applicationRepository, notificationService) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.userWalletTransactionRepository = userWalletTransactionRepository;
        this.debitAdminWalletUseCase = debitAdminWalletUseCase;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }
    async execute(requestId, adminId, approved, notes, overrideAction) {
        // 1. Fetch Request
        const paymentRequest = await this.paymentRequestRepository.findById(requestId);
        if (!paymentRequest) {
            throw new AppError_1.NotFoundError('Payment request not found');
        }
        if (!paymentRequest.isPending()) {
            throw new AppError_1.ValidationError('Payment request is already processed');
        }
        // 2. Fetch Project
        const project = await this.projectRepository.findById(paymentRequest.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        if (overrideAction === 'OVERRIDE_RELEASE') {
            if (paymentRequest.type !== ProjectPaymentRequest_1.ProjectPaymentRequestType.REFUND) {
                throw new AppError_1.ValidationError('Override Release can only be applied to Refund requests');
            }
            // 1. Mark the original REFUND request as REJECTED (Dispute resolved in favor of Contributor)
            try {
                paymentRequest.reject(adminId, `[OVERRIDE RELEASE] ${notes || 'Admin overrode refund request to release payment.'}`);
                await this.paymentRequestRepository.update(paymentRequest);
            }
            catch (error) {
                console.error(`[ProcessPaymentRequest] Failed to reject refund request ${requestId}:`, error);
                throw new AppError_1.InternalServerError(`Failed to process refund rejection during override: ${error.message}`);
            }
            // 2. Create a new RELEASE request and Approve it immediately
            try {
                // Get the accepted application to find the contributor
                const acceptedApplication = await this.applicationRepository.findAcceptedByProject(project.id);
                if (!acceptedApplication) {
                    throw new AppError_1.NotFoundError('No accepted application found for this project to release payment to.');
                }
                const contributorId = acceptedApplication.applicantId;
                // RELEASE logic (similar to strictly approving a release)
                // Debit Admin Wallet
                await this.debitAdminWalletUseCase.execute({
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: 'PROJECT_RELEASE',
                    referenceId: project.id,
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
                    throw new AppError_1.NotFoundError(`Contributor user ${contributorId} not found`);
                }
                const previousBalance = recipient.walletBalance;
                recipient.creditWallet(paymentRequest.amount);
                const newBalance = recipient.walletBalance;
                await this.userRepository.update(recipient);
                // Create Transaction Record for Contributor
                const transaction = UserWalletTransaction_1.UserWalletTransaction.create({
                    id: (0, uuid_1.v4)(),
                    userId: recipient.id,
                    type: UserWalletTransaction_1.UserWalletTransactionType.PROJECT_EARNING,
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
                    status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await this.userWalletTransactionRepository.create(transaction);
                // Mark Project as COMPLETED
                project.markAsCompleted();
                // Create audit record for the Overridden Release
                const releaseRequest = ProjectPaymentRequest_1.ProjectPaymentRequest.create({
                    id: (0, uuid_1.v4)(),
                    projectId: project.id,
                    type: ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE,
                    amount: paymentRequest.amount,
                    requestedBy: adminId,
                    recipientId: recipient.id,
                    status: ProjectPaymentRequest_1.ProjectPaymentRequestStatus.APPROVED,
                    processedBy: adminId,
                    processedAt: new Date(),
                    adminNotes: `Auto-created via Dispute Resolution Override. Original Refund Request: ${paymentRequest.id}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    requesterNotes: `Override Release for Dispute Resolution`
                });
                await this.paymentRequestRepository.create(releaseRequest);
                // Notify contributor about payment received (Dispute resolved in their favor)
                await this.notificationService.send({
                    userId: contributorId,
                    type: Notification_1.NotificationType.PAYMENT_RECEIVED,
                    title: 'Payment Received',
                    message: `You received ₹${paymentRequest.amount} for "${project.title}". Dispute resolved in your favor.`,
                    data: {
                        projectId: project.id,
                        amount: paymentRequest.amount,
                        isDisputeResolution: true
                    },
                });
            }
            catch (error) {
                console.error(`[ProcessPaymentRequest] Failed to execute Override Release for ${requestId}:`, error);
                throw new AppError_1.InternalServerError(`Failed to execute Override Release: ${error.message}`);
            }
        }
        else if (approved) {
            // 3. Process Approval (Standard Flow)
            try {
                // Debit Admin Wallet
                await this.debitAdminWalletUseCase.execute({
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: paymentRequest.type === ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE ? 'PROJECT_RELEASE' : 'PROJECT_REFUND',
                    referenceId: paymentRequest.id,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        recipientId: paymentRequest.recipientId
                    }
                });
                // Credit Recipient
                const recipient = await this.userRepository.findById(paymentRequest.recipientId);
                if (!recipient) {
                    throw new AppError_1.NotFoundError(`Recipient user ${paymentRequest.recipientId} not found`);
                }
                const previousBalance = recipient.walletBalance;
                recipient.creditWallet(paymentRequest.amount);
                const newBalance = recipient.walletBalance;
                await this.userRepository.update(recipient);
                // Create User Wallet Transaction Record
                const transactionType = paymentRequest.type === ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE
                    ? UserWalletTransaction_1.UserWalletTransactionType.PROJECT_EARNING
                    : UserWalletTransaction_1.UserWalletTransactionType.REFUND;
                const transaction = UserWalletTransaction_1.UserWalletTransaction.create({
                    id: (0, uuid_1.v4)(),
                    userId: paymentRequest.recipientId,
                    type: transactionType,
                    amount: paymentRequest.amount,
                    currency: 'INR',
                    source: paymentRequest.type === ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE ? 'PROJECT_COMPLETION' : 'PROJECT_REFUND',
                    referenceId: project.id,
                    description: paymentRequest.type === ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE
                        ? `Payment for project: ${project.title}`
                        : `Refund for project: ${project.title}`,
                    metadata: {
                        projectId: project.id,
                        projectTitle: project.title,
                        paymentRequestId: paymentRequest.id,
                    },
                    previousBalance,
                    newBalance,
                    status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await this.userWalletTransactionRepository.create(transaction);
                // Update Project Status
                if (paymentRequest.type === ProjectPaymentRequest_1.ProjectPaymentRequestType.RELEASE) {
                    project.markAsCompleted();
                    // Notify contributor about payment received
                    await this.notificationService.send({
                        userId: paymentRequest.recipientId,
                        type: Notification_1.NotificationType.PAYMENT_RECEIVED,
                        title: 'Payment Received',
                        message: `You received ₹${paymentRequest.amount} for completing "${project.title}"`,
                        data: {
                            projectId: project.id,
                            amount: paymentRequest.amount
                        },
                    });
                    // Also notify project owner that project is completed
                    await this.notificationService.send({
                        userId: project.clientId,
                        type: Notification_1.NotificationType.PROJECT_COMPLETION_APPROVED,
                        title: 'Project Completed',
                        message: `"${project.title}" has been marked as completed. Payment released to contributor.`,
                        data: {
                            projectId: project.id,
                            status: 'COMPLETED'
                        },
                    });
                }
                else {
                    project.markAsCancelled();
                    // Notify project owner about refund
                    await this.notificationService.send({
                        userId: paymentRequest.recipientId,
                        type: Notification_1.NotificationType.CREDITS_RECEIVED,
                        title: 'Refund Received',
                        message: `You received a refund of ₹${paymentRequest.amount} for "${project.title}"`,
                        data: {
                            projectId: project.id,
                            amount: paymentRequest.amount
                        },
                    });
                    // Notify contributor about project cancellation
                    const acceptedApplication = await this.applicationRepository.findAcceptedByProject(project.id);
                    if (acceptedApplication) {
                        await this.notificationService.send({
                            userId: acceptedApplication.applicantId,
                            type: Notification_1.NotificationType.PROJECT_COMPLETION_REJECTED,
                            title: 'Project Cancelled',
                            message: `"${project.title}" has been cancelled and refunded to the project owner.`,
                            data: {
                                projectId: project.id,
                                status: 'CANCELLED'
                            },
                        });
                    }
                }
                // Update Request Status
                paymentRequest.approve(adminId, notes);
            }
            catch (error) {
                console.error(`[ProcessPaymentRequest] Failed to process approval for ${requestId}:`, error);
                throw new AppError_1.InternalServerError(`Failed to process payment approval: ${error.message}`);
            }
        }
        else {
            // 4. Process Rejection
            // Revert project status to PENDING_COMPLETION so it can be reviewed again
            try {
                project.revertToPendingCompletion();
                paymentRequest.reject(adminId, notes);
                // Notify project owner about rejection
                await this.notificationService.send({
                    userId: project.clientId,
                    type: Notification_1.NotificationType.PROJECT_COMPLETION_REJECTED,
                    title: 'Payment Request Rejected',
                    message: `Payment request for "${project.title}" was rejected by admin. ${notes || 'Please review and resubmit.'}`,
                    data: {
                        projectId: project.id,
                        reason: notes
                    },
                });
            }
            catch (error) {
                console.error(`[ProcessPaymentRequest] Failed to process rejection for ${requestId}:`, error);
                throw new AppError_1.InternalServerError(`Failed to process payment rejection: ${error.message}`);
            }
        }
        // Save changes
        await this.projectRepository.update(project);
        await this.paymentRequestRepository.update(paymentRequest);
    }
};
exports.ProcessProjectPaymentRequestUseCase = ProcessProjectPaymentRequestUseCase;
exports.ProcessProjectPaymentRequestUseCase = ProcessProjectPaymentRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectPaymentRequestRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IDebitAdminWalletUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ProcessProjectPaymentRequestUseCase);
//# sourceMappingURL=ProcessProjectPaymentRequestUseCase.js.map