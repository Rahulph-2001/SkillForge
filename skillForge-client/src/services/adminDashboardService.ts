import api from './api';

export interface AdminDashboardStats {
    // Overview Stats
    totalUsers: number;
    activeUsers: number;
    userGrowthPercentage: number;

    totalSkills: number;
    pendingSkillsCount: number;
    skillGrowthPercentage: number;

    totalSessions: number;
    sessionsThisWeek: number;
    sessionGrowthPercentage: number;

    totalRevenue: number;
    revenueThisWeek: number;
    revenueGrowthPercentage: number;

    // Revenue Breakdown
    creditSalesRevenue: number;
    creditsSoldCount: number;
    creditsRedeemedAmount: number;
    creditsRedeemedCount: number;
    netRevenue: number;
    profitMargin: number;

    // Wallet Stats
    totalWalletBalance: number;
    totalUsersWithBalance: number;
    creditsRedeemedThisMonth: number;
    pendingWithdrawals: number;
    pendingWithdrawalsCount: number;
    completedWithdrawals: number;
    completedWithdrawalsCount: number;
    completedWithdrawalsThisMonth: number;

    // Platform Activity (Last 24 hours)
    newRegistrations24h: number;
    newRegistrationsGrowth: number;
    newSkills24h: number;
    newSkillsGrowth: number;
    sessionsCompleted24h: number;
    sessionsCompletedGrowth: number;

    // Recent Data
    recentUsers: Array<{
        id: string;
        name: string;
        email: string;
        location?: string;
        credits: number;
        createdAt: Date;
    }>;

    recentSessions: Array<{
        id: string;
        skillTitle: string;
        providerName: string;
        learnerName: string;
        status: string;
        scheduledAt: Date;
    }>;

    // Pending Items
    pendingReports: Array<{
        id: string;
        type: string;
        description: string;
        reportedBy: string;
        createdAt: Date;
    }>;
}

export const adminDashboardService = {
    async getDashboardStats(): Promise<AdminDashboardStats> {
        const response = await api.get('/admin/dashboard/stats');
        return response.data.data;
    },
};
