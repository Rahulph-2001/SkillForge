import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IAdminGetProjectStatsUseCase } from './interfaces/IAdminGetProjectStatsUseCase';
import { AdminProjectStatsDTO } from '../../dto/admin/AdminProjectDTO';
export declare class AdminGetProjectStatsUseCase implements IAdminGetProjectStatsUseCase {
    private readonly projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(): Promise<AdminProjectStatsDTO>;
}
//# sourceMappingURL=AdminGetProjectStatsUseCase.d.ts.map