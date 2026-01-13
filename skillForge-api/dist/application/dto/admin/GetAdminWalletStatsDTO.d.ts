import { z } from 'zod';
export declare const GetAdminWalletStatsResponseSchema: z.ZodObject<{
    platformWalletBalance: z.ZodNumber;
    totalUsers: z.ZodNumber;
    creditsRedeemed: z.ZodNumber;
    creditsRedeemedCount: z.ZodNumber;
    creditsRedeemedThisMonth: z.ZodNumber;
    pendingWithdrawals: z.ZodNumber;
    pendingWithdrawalsCount: z.ZodNumber;
    completedWithdrawals: z.ZodNumber;
    completedWithdrawalsCount: z.ZodNumber;
    completedWithdrawalsThisMonth: z.ZodNumber;
    totalInEscrow: z.ZodNumber;
    activeProjectsCount: z.ZodNumber;
    awaitingApproval: z.ZodNumber;
    awaitingApprovalCount: z.ZodNumber;
}, z.core.$strip>;
export type GetAdminWalletStatsResponseDTO = z.infer<typeof GetAdminWalletStatsResponseSchema>;
//# sourceMappingURL=GetAdminWalletStatsDTO.d.ts.map