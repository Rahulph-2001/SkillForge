import { z } from 'zod';

// Main Dashboard Stats Response
export const AdminDashboardStatsResponseDTOSchema = z.object({
  // Overview Stats
  totalUsers: z.number(),
  activeUsers: z.number(),
  userGrowthPercentage: z.number(),
  
  totalSkills: z.number(),
  pendingSkillsCount: z.number(),
  skillGrowthPercentage: z.number(),
  
  totalSessions: z.number(),
  sessionsThisWeek: z.number(),
  sessionGrowthPercentage: z.number(),
  
  totalRevenue: z.number(),
  revenueThisWeek: z.number(),
  revenueGrowthPercentage: z.number(),
  
  // Revenue Breakdown
  creditSalesRevenue: z.number(),
  creditsSoldCount: z.number(),
  creditsRedeemedAmount: z.number(),
  creditsRedeemedCount: z.number(),
  netRevenue: z.number(),
  profitMargin: z.number(),
  
  // Wallet Stats
  totalWalletBalance: z.number(),
  totalUsersWithBalance: z.number(),
  creditsRedeemedThisMonth: z.number(),
  pendingWithdrawals: z.number(),
  pendingWithdrawalsCount: z.number(),
  completedWithdrawals: z.number(),
  completedWithdrawalsCount: z.number(),
  completedWithdrawalsThisMonth: z.number(),
  
  // Platform Activity (Last 24 hours)
  newRegistrations24h: z.number(),
  newRegistrationsGrowth: z.number(),
  newSkills24h: z.number(),
  newSkillsGrowth: z.number(),
  sessionsCompleted24h: z.number(),
  sessionsCompletedGrowth: z.number(),
  
  // Recent Data
  recentUsers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    location: z.string().optional(),
    credits: z.number(),
    createdAt: z.coerce.date(),
  })),
  
  recentSessions: z.array(z.object({
    id: z.string(),
    skillTitle: z.string(),
    providerName: z.string(),
    learnerName: z.string(),
    status: z.string(),
    scheduledAt: z.coerce.date(),
  })),
  
  // Pending Items
  pendingReports: z.array(z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    reportedBy: z.string(),
    createdAt: z.coerce.date(),
  })),
});

export type AdminDashboardStatsResponseDTO = z.infer<typeof AdminDashboardStatsResponseDTOSchema>;