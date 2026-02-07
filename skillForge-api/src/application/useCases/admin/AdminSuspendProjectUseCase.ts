import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { IAdminSuspendProjectUseCase } from './interfaces/IAdminSuspendProjectUseCase';
import { AdminSuspendProjectRequestDTO, AdminSuspendProjectResponseDTO } from '../../dto/admin/AdminSuspendProjectDTO';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { NotificationType } from '../../../domain/entities/Notification';
import { PaymentStatus } from '../../../domain/enums/PaymentEnums';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AdminSuspendProjectUseCase implements IAdminSuspendProjectUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IUserWalletTransactionRepository) private readonly userWalletTransactionRepository: IUserWalletTransactionRepository,
        @inject(TYPES.IDebitAdminWalletUseCase) private readonly debitAdminWalletUseCase: IDebitAdminWalletUseCase,
        @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
    ) { }

    async execute(
        projectId: string,
        dto: AdminSuspendProjectRequestDTO,
        _adminId: string
    ): Promise<AdminSuspendProjectResponseDTO> {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.isSuspended) {
            throw new ValidationError('Project is already suspended');
        }

        project.suspend(dto.reason);

        let refundProcessed = false;

        // If withRefund is true and payment exists with SUCCEEDED status, process refund
        if (dto.withRefund && project.paymentId) {
            const payment = await this.paymentRepository.findById(project.paymentId);
            if (payment && payment.status === PaymentStatus.SUCCEEDED) {
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
                        referenceId: project.id!,
                        metadata: {
                            projectTitle: project.title,
                            reason: dto.reason,
                        },
                    });

                    // Mark payment as refunded
                    payment.markAsRefunded(payment.amount);
                    await this.paymentRepository.update(payment);

                    // Create Transaction Record
                    const transaction = UserWalletTransaction.create({
                        id: uuidv4(),
                        userId: creator.id,
                        type: UserWalletTransactionType.REFUND,
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
                        status: UserWalletTransactionStatus.COMPLETED,
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
            type: NotificationType.COMMUNITY_UPDATE,
            title: 'Project Suspended',
            message: `Your project "${project.title}" has been suspended by admin. Reason: ${dto.reason}`,
            data: { projectId: project.id },
        });

        return {
            id: project.id!,
            title: project.title,
            isSuspended: project.isSuspended,
            suspendedAt: project.suspendedAt!,
            suspendReason: project.suspendReason!,
            refundProcessed,
        };
    }
}