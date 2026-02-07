import { IUpdateApplicationStatusUseCase } from './interfaces/IUpdateApplicationStatusUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class UpdateApplicationStatusUseCase implements IUpdateApplicationStatusUseCase {
    private readonly applicationRepository;
    private readonly projectRepository;
    private readonly mapper;
    private readonly notificationService;
    constructor(applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, mapper: IProjectApplicationMapper, notificationService: INotificationService);
    execute(applicationId: string, clientId: string, status: ProjectApplicationStatus): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=UpdateApplicationStatusUseCase.d.ts.map