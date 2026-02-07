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
exports.AdminSuspendProjectUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
const uuid_1 = require("uuid");
let AdminSuspendProjectUseCase = class AdminSuspendProjectUseCase {
    constructor(projectRepository, paymentRepository, userRepository, userWalletTransactionRepository, debitAdminWalletUseCase, notificationService) {
        this.projectRepository = projectRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.userWalletTransactionRepository = userWalletTransactionRepository;
        this.debitAdminWalletUseCase = debitAdminWalletUseCase;
        this.notificationService = notificationService;
    }
    async execute(projectId, dto, _adminId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        if (project.isSuspended) {
            throw new AppError_1.ValidationError('Project is already suspended');
        }
        project.suspend(dto.reason);
        let refundProcessed = false;
        // If withRefund is true and payment exists with SUCCEEDED status, process refund
        if (dto.withRefund && project.paymentId) {
            const payment = await this.paymentRepository.findById(project.paymentId);
            if (payment && payment.status === PaymentEnums_1.PaymentStatus.SUCCEEDED) {
                const creator = await this.userRepository.findById(project.clientId);
                if (creator) {
                    const previousBalance = creator.walletBalance;
                    // Refund to wallet instead of credits
                    creator.creditWallet(payment.amount);
                    await this.userRepository.update(creator);
                    const newBalance = creator.walletBalance;
                    // Debit from admin wallet using use case
                    await this.debitAdminWalletUseCase.execute({
                        amount: payment.amount,
                        currency: payment.currency,
                        source: 'PROJECT_REFUND',
                        referenceId: project.id,
                        metadata: {
                            projectTitle: project.title,
                            reason: dto.reason,
                        },
                    });
                    // Mark payment as refunded
                    payment.markAsRefunded(payment.amount);
                    await this.paymentRepository.update(payment);
                    // Create Transaction Record
                    const transaction = UserWalletTransaction_1.UserWalletTransaction.create({
                        id: (0, uuid_1.v4)(),
                        userId: creator.id,
                        type: UserWalletTransaction_1.UserWalletTransactionType.REFUND,
                        amount: payment.amount,
                        currency: payment.currency,
                        source: 'PROJECT_REFUND',
                        referenceId: project.id,
                        description: `Refund for suspended project: ${project.title}`,
                        metadata: {
                            projectId: project.id,
                            projectTitle: project.title,
                            reason: dto.reason,
                            paymentId: payment.id
                        },
                        previousBalance,
                        newBalance,
                        status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    await this.userWalletTransactionRepository.create(transaction);
                    refundProcessed = true;
                }
            }
        }
        await this.projectRepository.update(project);
        // Send notification to project creator
        await this.notificationService.send({
            userId: project.clientId,
            type: Notification_1.NotificationType.COMMUNITY_UPDATE,
            title: 'Project Suspended',
            message: `Your project "${project.title}" has been suspended by admin. Reason: ${dto.reason}`,
            data: { projectId: project.id },
        });
        return {
            id: project.id,
            title: project.title,
            isSuspended: project.isSuspended,
            suspendedAt: project.suspendedAt,
            suspendReason: project.suspendReason,
            refundProcessed,
        };
    }
};
exports.AdminSuspendProjectUseCase = AdminSuspendProjectUseCase;
exports.AdminSuspendProjectUseCase = AdminSuspendProjectUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IDebitAdminWalletUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AdminSuspendProjectUseCase);
//# sourceMappingURL=AdminSuspendProjectUseCase.js.map