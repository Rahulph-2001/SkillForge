"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardStatsResponseDTOSchema = void 0;
const zod_1 = require("zod");
// Main Dashboard Stats Response
exports.AdminDashboardStatsResponseDTOSchema = zod_1.z.object({
    // Overview Stats
    totalUsers: zod_1.z.number(),
    activeUsers: zod_1.z.number(),
    userGrowthPercentage: zod_1.z.number(),
    totalSkills: zod_1.z.number(),
    pendingSkillsCount: zod_1.z.number(),
    skillGrowthPercentage: zod_1.z.number(),
    totalSessions: zod_1.z.number(),
    sessionsThisWeek: zod_1.z.number(),
    sessionGrowthPercentage: zod_1.z.number(),
    totalRevenue: zod_1.z.number(),
    revenueThisWeek: zod_1.z.number(),
    revenueGrowthPercentage: zod_1.z.number(),
    // Revenue Breakdown
    creditSalesRevenue: zod_1.z.number(),
    creditsSoldCount: zod_1.z.number(),
    creditsRedeemedAmount: zod_1.z.number(),
    creditsRedeemedCount: zod_1.z.number(),
    netRevenue: zod_1.z.number(),
    profitMargin: zod_1.z.number(),
    // Wallet Stats
    totalWalletBalance: zod_1.z.number(),
    totalUsersWithBalance: zod_1.z.number(),
    creditsRedeemedThisMonth: zod_1.z.number(),
    pendingWithdrawals: zod_1.z.number(),
    pendingWithdrawalsCount: zod_1.z.number(),
    completedWithdrawals: zod_1.z.number(),
    completedWithdrawalsCount: zod_1.z.number(),
    completedWithdrawalsThisMonth: zod_1.z.number(),
    // Platform Activity (Last 24 hours)
    newRegistrations24h: zod_1.z.number(),
    newRegistrationsGrowth: zod_1.z.number(),
    newSkills24h: zod_1.z.number(),
    newSkillsGrowth: zod_1.z.number(),
    sessionsCompleted24h: zod_1.z.number(),
    sessionsCompletedGrowth: zod_1.z.number(),
    // Recent Data
    recentUsers: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        location: zod_1.z.string().optional(),
        credits: zod_1.z.number(),
        createdAt: zod_1.z.coerce.date(),
    })),
    recentSessions: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        skillTitle: zod_1.z.string(),
        providerName: zod_1.z.string(),
        learnerName: zod_1.z.string(),
        status: zod_1.z.string(),
        scheduledAt: zod_1.z.coerce.date(),
    })),
    // Pending Items
    pendingReports: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.string(),
        description: zod_1.z.string(),
        reportedBy: zod_1.z.string(),
        createdAt: zod_1.z.coerce.date(),
    })),
});
//# sourceMappingURL=GetAdminDashboardStatsDTO.js.map