export interface AdminCreditStats {
    totalRevenue: number;
    creditsSold: number;
    avgOrderValue: number;
    totalTransactions: number;
}
export interface IGetAdminCreditStatsUseCase {
    execute(): Promise<AdminCreditStats>;
}
//# sourceMappingURL=IGetAdminCreditStatsUseCase.d.ts.map