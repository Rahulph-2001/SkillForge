"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminWalletStatsResponseSchema = void 0;
const zod_1 = require("zod");
exports.GetAdminWalletStatsResponseSchema = zod_1.z.object({
    platformWalletBalance: zod_1.z.number(),
    totalUsers: zod_1.z.number(),
    creditsRedeemed: zod_1.z.number(),
    creditsRedeemedCount: zod_1.z.number(),
    creditsRedeemedThisMonth: zod_1.z.number(),
    pendingWithdrawals: zod_1.z.number(),
    pendingWithdrawalsCount: zod_1.z.number(),
    completedWithdrawals: zod_1.z.number(),
    completedWithdrawalsCount: zod_1.z.number(),
    completedWithdrawalsThisMonth: zod_1.z.number(),
    totalInEscrow: zod_1.z.number(),
    activeProjectsCount: zod_1.z.number(),
    awaitingApproval: zod_1.z.number(),
    awaitingApprovalCount: zod_1.z.number(),
});
//# sourceMappingURL=GetAdminWalletStatsDTO.js.map