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
exports.GetAdminDashboardStatsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserRole_1 = require("../../../domain/enums/UserRole");
const Booking_1 = require("../../../domain/entities/Booking");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let GetAdminDashboardStatsUseCase = class GetAdminDashboardStatsUseCase {
    constructor(userRepository, skillRepository, bookingRepository, paymentRepository, transactionRepository, reportRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.transactionRepository = transactionRepository;
        this.reportRepository = reportRepository;
    }
    async execute(adminUserId) {
        // Verify admin user
        const adminUser = await this.userRepository.findById(adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // Date ranges
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysStart = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        // User Stats
        const totalUsers = await this.userRepository.countTotal();
        const activeUsers = await this.userRepository.countActive();
        const usersThisMonth = await this.userRepository.countByDateRange(monthStart, now);
        const usersLastMonth = await this.userRepository.countByDateRange(lastMonthStart, lastMonthEnd);
        const userGrowthPercentage = usersLastMonth > 0 ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 : 0;
        // Skill Stats
        const totalSkills = await this.skillRepository.countTotal();
        const pendingSkillsCount = await this.skillRepository.countPending();
        const skillsThisMonth = await this.skillRepository.countByDateRange(monthStart, now);
        const skillsLastMonth = await this.skillRepository.countByDateRange(lastMonthStart, lastMonthEnd);
        const skillGrowthPercentage = skillsLastMonth > 0 ? ((skillsThisMonth - skillsLastMonth) / skillsLastMonth) * 100 : 0;
        // Session Stats
        const totalSessions = await this.bookingRepository.countTotal();
        const sessionsThisWeek = await this.bookingRepository.countByDateRange(weekStart, now);
        const sessionsThisMonth = await this.bookingRepository.countByDateRange(monthStart, now);
        const sessionsLastMonth = await this.bookingRepository.countByDateRange(lastMonthStart, lastMonthEnd);
        const sessionGrowthPercentage = sessionsLastMonth > 0 ? ((sessionsThisMonth - sessionsLastMonth) / sessionsLastMonth) * 100 : 0;
        // Revenue Stats
        const totalRevenue = await this.paymentRepository.getTotalRevenue();
        const revenueThisWeek = await this.paymentRepository.getRevenueByDateRange(weekStart, now);
        const revenueThisMonth = await this.paymentRepository.getRevenueByDateRange(monthStart, now);
        const revenueLastMonth = await this.paymentRepository.getRevenueByDateRange(lastMonthStart, lastMonthEnd);
        const revenueGrowthPercentage = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0;
        // Credit Sales Revenue (CREDIT_PURCHASE transactions)
        const creditSalesRevenue = Math.abs(await this.transactionRepository.getTotalByType(UserWalletTransaction_1.UserWalletTransactionType.CREDIT_PURCHASE));
        const creditsSoldCount = await this.transactionRepository.countByType(UserWalletTransaction_1.UserWalletTransactionType.CREDIT_PURCHASE);
        // Credits Redeemed (CREDIT_REDEMPTION transactions)
        const creditsRedeemedAmount = Math.abs(await this.transactionRepository.getTotalByType(UserWalletTransaction_1.UserWalletTransactionType.CREDIT_REDEMPTION));
        const creditsRedeemedCount = await this.transactionRepository.countByType(UserWalletTransaction_1.UserWalletTransactionType.CREDIT_REDEMPTION);
        const creditsRedeemedThisMonth = Math.abs(await this.transactionRepository.getTotalByTypeAndDateRange(UserWalletTransaction_1.UserWalletTransactionType.CREDIT_REDEMPTION, monthStart, now));
        // Net Revenue and Profit Margin
        const netRevenue = creditSalesRevenue - creditsRedeemedAmount;
        const profitMargin = creditSalesRevenue > 0 ? (netRevenue / creditSalesRevenue) * 100 : 0;
        // Wallet Stats
        const totalWalletBalance = await this.userRepository.getTotalWalletBalance();
        const totalUsersWithBalance = await this.userRepository.countUsersWithBalance();
        // Withdrawals (WITHDRAWAL transactions)
        const pendingWithdrawals = Math.abs(await this.transactionRepository.getTotalByTypeAndStatus(UserWalletTransaction_1.UserWalletTransactionType.WITHDRAWAL, UserWalletTransaction_1.UserWalletTransactionStatus.PENDING));
        const pendingWithdrawalsCount = await this.transactionRepository.countByTypeAndStatus(UserWalletTransaction_1.UserWalletTransactionType.WITHDRAWAL, UserWalletTransaction_1.UserWalletTransactionStatus.PENDING);
        const completedWithdrawals = Math.abs(await this.transactionRepository.getTotalByTypeAndStatus(UserWalletTransaction_1.UserWalletTransactionType.WITHDRAWAL, UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED));
        const completedWithdrawalsCount = await this.transactionRepository.countByTypeAndStatus(UserWalletTransaction_1.UserWalletTransactionType.WITHDRAWAL, UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED);
        const completedWithdrawalsThisMonth = Math.abs(await this.transactionRepository.getTotalByTypeAndDateRange(UserWalletTransaction_1.UserWalletTransactionType.WITHDRAWAL, monthStart, now));
        // Platform Activity (24h)
        const newRegistrations24h = await this.userRepository.countByDateRange(dayStart, now);
        const newRegistrations48h = await this.userRepository.countByDateRange(twoDaysStart, dayStart);
        const newRegistrationsGrowth = newRegistrations48h > 0 ? ((newRegistrations24h - newRegistrations48h) / newRegistrations48h) * 100 : 0;
        const newSkills24h = await this.skillRepository.countByDateRange(dayStart, now);
        const newSkills48h = await this.skillRepository.countByDateRange(twoDaysStart, dayStart);
        const newSkillsGrowth = newSkills48h > 0 ? ((newSkills24h - newSkills48h) / newSkills48h) * 100 : 0;
        const sessionsCompleted24h = await this.bookingRepository.countByStatusAndDateRange(Booking_1.BookingStatus.COMPLETED, dayStart, now);
        const sessionsCompleted48h = await this.bookingRepository.countByStatusAndDateRange(Booking_1.BookingStatus.COMPLETED, twoDaysStart, dayStart);
        const sessionsCompletedGrowth = sessionsCompleted48h > 0 ? ((sessionsCompleted24h - sessionsCompleted48h) / sessionsCompleted48h) * 100 : 0;
        // Recent Users
        const recentUsersEntities = await this.userRepository.findRecent(5);
        const recentUsers = recentUsersEntities.map(user => {
            const userData = user.toJSON();
            return {
                id: user.id,
                name: user.name,
                email: user.email.value,
                location: user.location || '',
                credits: user.credits,
                createdAt: userData.created_at,
            };
        });
        // Recent Sessions
        const recentSessionsEntities = await this.bookingRepository.findRecent(5);
        const recentSessions = recentSessionsEntities.map(booking => ({
            id: booking.id || '',
            skillTitle: booking.skillTitle || 'Unknown Skill',
            providerName: booking.providerName || 'Unknown Provider',
            learnerName: booking.learnerName || 'Unknown Learner',
            status: booking.status,
            scheduledAt: booking.startAt || booking.createdAt,
        }));
        // Pending Reports
        const pendingReportsEntities = await this.reportRepository.findPendingReports(5);
        const pendingReports = pendingReportsEntities.map(report => ({
            id: report.id || '',
            type: report.props.type || 'General',
            description: report.props.description,
            reportedBy: report.props.reporter?.name || 'Unknown User',
            createdAt: report.props.createdAt,
        }));
        return {
            totalUsers,
            activeUsers,
            userGrowthPercentage,
            totalSkills,
            pendingSkillsCount,
            skillGrowthPercentage,
            totalSessions,
            sessionsThisWeek,
            sessionGrowthPercentage,
            totalRevenue,
            revenueThisWeek,
            revenueGrowthPercentage,
            creditSalesRevenue,
            creditsSoldCount,
            creditsRedeemedAmount,
            creditsRedeemedCount,
            netRevenue,
            profitMargin,
            totalWalletBalance,
            totalUsersWithBalance,
            creditsRedeemedThisMonth,
            pendingWithdrawals,
            pendingWithdrawalsCount,
            completedWithdrawals,
            completedWithdrawalsCount,
            completedWithdrawalsThisMonth,
            newRegistrations24h,
            newRegistrationsGrowth,
            newSkills24h,
            newSkillsGrowth,
            sessionsCompleted24h,
            sessionsCompletedGrowth,
            recentUsers,
            recentSessions,
            pendingReports,
        };
    }
};
exports.GetAdminDashboardStatsUseCase = GetAdminDashboardStatsUseCase;
exports.GetAdminDashboardStatsUseCase = GetAdminDashboardStatsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IReportRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], GetAdminDashboardStatsUseCase);
//# sourceMappingURL=GetAdminDashboardStatsUseCase.js.map