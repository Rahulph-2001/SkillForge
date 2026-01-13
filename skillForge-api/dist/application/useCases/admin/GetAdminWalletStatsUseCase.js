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
exports.GetAdminWalletStatsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserRole_1 = require("../../../domain/enums/UserRole");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const Project_1 = require("../../../domain/entities/Project");
const AppError_1 = require("../../../domain/errors/AppError");
let GetAdminWalletStatsUseCase = class GetAdminWalletStatsUseCase {
    constructor(userRepository, paymentRepository, projectRepository, paginationService) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.projectRepository = projectRepository;
        this.paginationService = paginationService;
    }
    async execute() {
        // Find admin user
        const users = await this.userRepository.findAll();
        const adminUser = users.find(user => user.role === UserRole_1.UserRole.ADMIN);
        if (!adminUser) {
            throw new AppError_1.NotFoundError('No admin user found in the system');
        }
        const adminWalletBalance = adminUser.toJSON().wallet_balance || 0;
        const totalUsers = users.filter(u => u.role === UserRole_1.UserRole.USER).length;
        // Get current month start
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        // Get all successful subscription payments (these are credits to admin wallet)
        // IMPORTANT: Subscription payments are made by regular users, not admin user
        // So we need to get ALL subscription payments, not just admin user's payments
        const paginationParams = this.paginationService.createParams(1, 10000);
        const allPaymentsResult = await this.paymentRepository.findWithPagination(paginationParams, {
            purpose: PaymentEnums_1.PaymentPurpose.SUBSCRIPTION,
            status: PaymentEnums_1.PaymentStatus.SUCCEEDED,
        });
        const subscriptionPayments = allPaymentsResult.data;
        // Calculate credits redeemed (subscription payments)
        const creditsRedeemed = subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);
        const creditsRedeemedThisMonth = subscriptionPayments
            .filter(p => p.createdAt >= monthStart)
            .reduce((sum, p) => sum + p.amount, 0);
        // Get active projects for escrow calculation
        const activeProjectsResult = await this.projectRepository.listProjects({
            status: Project_1.ProjectStatus.IN_PROGRESS,
            page: 1,
            limit: 10000,
        });
        const openProjectsResult = await this.projectRepository.listProjects({
            status: Project_1.ProjectStatus.OPEN,
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
};
exports.GetAdminWalletStatsUseCase = GetAdminWalletStatsUseCase;
exports.GetAdminWalletStatsUseCase = GetAdminWalletStatsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetAdminWalletStatsUseCase);
//# sourceMappingURL=GetAdminWalletStatsUseCase.js.map