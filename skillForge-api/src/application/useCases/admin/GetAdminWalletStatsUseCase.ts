import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { UserRole } from '../../../domain/enums/UserRole';
import { PaymentPurpose, PaymentStatus } from '../../../domain/enums/PaymentEnums';
import { ProjectStatus } from '../../../domain/entities/Project';
import { IGetAdminWalletStatsUseCase } from './interfaces/IGetAdminWalletStatsUseCase';
import { GetAdminWalletStatsResponseDTO } from '../../dto/admin/GetAdminWalletStatsDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetAdminWalletStatsUseCase implements IGetAdminWalletStatsUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IPaginationService) private readonly paginationService: IPaginationService
    ) { }

    async execute(): Promise<GetAdminWalletStatsResponseDTO> {
        // Find admin user
        const users = await this.userRepository.findAll();
        const adminUser = users.find(user => user.role === UserRole.ADMIN);
        
        if (!adminUser) {
            throw new NotFoundError('No admin user found in the system');
        }

        const adminWalletBalance = adminUser.toJSON().wallet_balance as number || 0;
        const totalUsers = users.filter(u => u.role === UserRole.USER).length;

        // Get current month start
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all successful subscription payments (these are credits to admin wallet)
        // IMPORTANT: Subscription payments are made by regular users, not admin user
        // So we need to get ALL subscription payments, not just admin user's payments
        const paginationParams = this.paginationService.createParams(1, 10000);
        const allPaymentsResult = await this.paymentRepository.findWithPagination(
            paginationParams,
            {
                purpose: PaymentPurpose.SUBSCRIPTION,
                status: PaymentStatus.SUCCEEDED,
            }
        );
        const subscriptionPayments = allPaymentsResult.data;

        // Calculate credits redeemed (subscription payments)
        const creditsRedeemed = subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);
        const creditsRedeemedThisMonth = subscriptionPayments
            .filter(p => p.createdAt >= monthStart)
            .reduce((sum, p) => sum + p.amount, 0);

        // Get active projects for escrow calculation
        const activeProjectsResult = await this.projectRepository.listProjects({
            status: ProjectStatus.IN_PROGRESS,
            page: 1,
            limit: 10000,
        });
        const openProjectsResult = await this.projectRepository.listProjects({
            status: ProjectStatus.OPEN,
            page: 1,
            limit: 10000,
        });
        const activeProjects = [...activeProjectsResult.projects, ...openProjectsResult.projects];
        const totalInEscrow = activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

        // For now, we'll set placeholder values for withdrawals and approvals
        // These would need to be implemented based on your withdrawal system
        const pendingWithdrawals = 0;
        const pendingWithdrawalsCount = 0;
        const completedWithdrawals = 0;
        const completedWithdrawalsCount = 0;
        const completedWithdrawalsThisMonth = 0;
        const awaitingApproval = 0;
        const awaitingApprovalCount = 0;

        return {
            platformWalletBalance: adminWalletBalance,
            totalUsers,
            creditsRedeemed,
            creditsRedeemedCount: subscriptionPayments.length,
            creditsRedeemedThisMonth,
            pendingWithdrawals,
            pendingWithdrawalsCount,
            completedWithdrawals,
            completedWithdrawalsCount,
            completedWithdrawalsThisMonth,
            totalInEscrow,
            activeProjectsCount: activeProjects.length,
            awaitingApproval,
            awaitingApprovalCount,
        };
    }
}