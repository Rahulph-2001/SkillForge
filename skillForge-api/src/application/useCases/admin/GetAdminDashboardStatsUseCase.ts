import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IReportRepository } from '../../../domain/repositories/IReportRepository';
import { IGetAdminDashboardStatsUseCase } from './interfaces/IGetAdminDashboardStatsUseCase';
import { AdminDashboardStatsResponseDTO } from '../../dto/admin/GetAdminDashboardStatsDTO';
import { UserRole } from '../../../domain/enums/UserRole';
import { BookingStatus } from '../../../domain/entities/Booking';
import { PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
import { ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository,
    @inject(TYPES.IReportRepository) private readonly reportRepository: IReportRepository
  ) { }

  async execute(adminUserId: string): Promise<AdminDashboardStatsResponseDTO> {
    // Verify admin user
    const adminUser = await this.userRepository.findById(adminUserId);
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
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
    const creditSalesRevenue = Math.abs(await this.transactionRepository.getTotalByType(UserWalletTransactionType.CREDIT_PURCHASE));
    const creditsSoldCount = await this.transactionRepository.countByType(UserWalletTransactionType.CREDIT_PURCHASE);

    // Credits Redeemed (CREDIT_REDEMPTION transactions)
    const creditsRedeemedAmount = Math.abs(await this.transactionRepository.getTotalByType(UserWalletTransactionType.CREDIT_REDEMPTION));
    const creditsRedeemedCount = await this.transactionRepository.countByType(UserWalletTransactionType.CREDIT_REDEMPTION);
    const creditsRedeemedThisMonth = Math.abs(await this.transactionRepository.getTotalByTypeAndDateRange(
      UserWalletTransactionType.CREDIT_REDEMPTION,
      monthStart,
      now
    ));

    // Net Revenue and Profit Margin
    const netRevenue = creditSalesRevenue - creditsRedeemedAmount;
    const profitMargin = creditSalesRevenue > 0 ? (netRevenue / creditSalesRevenue) * 100 : 0;

    // Wallet Stats
    const totalWalletBalance = await this.userRepository.getTotalWalletBalance();
    const totalUsersWithBalance = await this.userRepository.countUsersWithBalance();

    // Withdrawals (WITHDRAWAL transactions)
    const pendingWithdrawals = Math.abs(await this.transactionRepository.getTotalByTypeAndStatus(
      UserWalletTransactionType.WITHDRAWAL,
      UserWalletTransactionStatus.PENDING
    ));
    const pendingWithdrawalsCount = await this.transactionRepository.countByTypeAndStatus(
      UserWalletTransactionType.WITHDRAWAL,
      UserWalletTransactionStatus.PENDING
    );
    const completedWithdrawals = Math.abs(await this.transactionRepository.getTotalByTypeAndStatus(
      UserWalletTransactionType.WITHDRAWAL,
      UserWalletTransactionStatus.COMPLETED
    ));
    const completedWithdrawalsCount = await this.transactionRepository.countByTypeAndStatus(
      UserWalletTransactionType.WITHDRAWAL,
      UserWalletTransactionStatus.COMPLETED
    );
    const completedWithdrawalsThisMonth = Math.abs(await this.transactionRepository.getTotalByTypeAndDateRange(
      UserWalletTransactionType.WITHDRAWAL,
      monthStart,
      now
    ));

    // Platform Activity (24h)
    const newRegistrations24h = await this.userRepository.countByDateRange(dayStart, now);
    const newRegistrations48h = await this.userRepository.countByDateRange(twoDaysStart, dayStart);
    const newRegistrationsGrowth = newRegistrations48h > 0 ? ((newRegistrations24h - newRegistrations48h) / newRegistrations48h) * 100 : 0;

    const newSkills24h = await this.skillRepository.countByDateRange(dayStart, now);
    const newSkills48h = await this.skillRepository.countByDateRange(twoDaysStart, dayStart);
    const newSkillsGrowth = newSkills48h > 0 ? ((newSkills24h - newSkills48h) / newSkills48h) * 100 : 0;

    const sessionsCompleted24h = await this.bookingRepository.countByStatusAndDateRange(BookingStatus.COMPLETED, dayStart, now);
    const sessionsCompleted48h = await this.bookingRepository.countByStatusAndDateRange(BookingStatus.COMPLETED, twoDaysStart, dayStart);
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
        createdAt: userData.created_at as Date,
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
}