import { IUpdateApplicationStatusUseCase } from './interfaces/IUpdateApplicationStatusUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
export declare class UpdateApplicationStatusUseCase implements IUpdateApplicationStatusUseCase {
    private readonly applicationRepository;
    private readonly projectRepository;
    private readonly mapper;
    constructor(applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, mapper: IProjectApplicationMapper);
    execute(applicationId: string, clientId: string, status: ProjectApplicationStatus): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=UpdateApplicationStatusUseCase.d.ts.map