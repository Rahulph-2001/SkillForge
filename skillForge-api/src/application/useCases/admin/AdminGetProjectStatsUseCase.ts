import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IAdminGetProjectStatsUseCase } from './interfaces/IAdminGetProjectStatsUseCase';
import { AdminProjectStatsDTO } from '../../dto/admin/AdminProjectDTO';

@injectable()
export class AdminGetProjectStatsUseCase implements IAdminGetProjectStatsUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository
    ) { }

    async execute(): Promise<AdminProjectStatsDTO> {
        const stats = await this.projectRepository.getStats();

        return {
            totalProjects: stats.totalProjects,
            openProjects: stats.openProjects,
            inProgressProjects: stats.inProgressProjects,
            completedProjects: stats.completedProjects,
            pendingApprovalProjects: stats.pendingApprovalProjects,
            cancelledProjects: stats.cancelledProjects,
            totalBudget: stats.totalBudget
        };
    }
}
