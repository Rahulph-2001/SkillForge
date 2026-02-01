import { IGetProjectApplicationsUseCase } from './interfaces/IGetProjectApplicationsUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
export declare class GetProjectApplicationsUseCase implements IGetProjectApplicationsUseCase {
    private readonly applicationRepository;
    private readonly projectRepository;
    private readonly skillRepository;
    private readonly mapper;
    constructor(applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, skillRepository: ISkillRepository, // Using ISkillRepository (any generic repository injection needed? No, wait)
    mapper: IProjectApplicationMapper);
    execute(projectId: string, userId: string): Promise<ProjectApplicationResponseDTO[]>;
}
//# sourceMappingURL=GetProjectApplicationsUseCase.d.ts.map