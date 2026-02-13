import { AdminDashboardStatsResponseDTO } from '../../../dto/admin/GetAdminDashboardStatsDTO';
export interface IGetAdminDashboardStatsUseCase {
    execute(adminUserId: string): Promise<AdminDashboardStatsResponseDTO>;
}
//# sourceMappingURL=IGetAdminDashboardStatsUseCase.d.ts.map