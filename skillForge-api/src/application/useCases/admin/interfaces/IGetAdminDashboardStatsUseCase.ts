import { AdminDashboardStatsResponseDTO } from '../../../dto/admin/GetAdminDashboardStatsDTO';

export interface IGetAdminDashboardStatsUseCase {
  execute(adminUserId: string): Promise<AdminDashboardStatsResponseDTO>;
}