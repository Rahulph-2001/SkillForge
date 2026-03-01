import { type AdminProjectStatsDTO } from '../../../dto/admin/AdminProjectDTO';

export interface IAdminGetProjectStatsUseCase {
    execute(): Promise<AdminProjectStatsDTO>;
}
