import { z } from 'zod';

export const GetAdminWalletStatsResponseSchema = z.object({
    platformWalletBalance: z.number(),
    totalUsers: z.number(),
    creditsRedeemed: z.number(),
    creditsRedeemedCount: z.number(),
    creditsRedeemedThisMonth: z.number(),
    pendingWithdrawals: z.number(),
    pendingWithdrawalsCount: z.number(),
    completedWithdrawals: z.number(),
    completedWithdrawalsCount: z.number(),
    completedWithdrawalsThisMonth: z.number(),
    totalInEscrow: z.number(),
    activeProjectsCount: z.number(),
    awaitingApproval: z.number(),
    awaitingApprovalCount: z.number(),
});

export type GetAdminWalletStatsResponseDTO = z.infer<typeof GetAdminWalletStatsResponseSchema>;