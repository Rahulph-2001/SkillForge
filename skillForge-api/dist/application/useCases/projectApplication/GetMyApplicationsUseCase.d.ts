import { IGetMyApplicationsUseCase } from './interfaces/IGetMyApplicationsUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
export declare class GetMyApplicationsUseCase implements IGetMyApplicationsUseCase {
    private readonly applicationRepository;
    private readonly mapper;
    constructor(applicationRepository: IProjectApplicationRepository, mapper: IProjectApplicationMapper);
    execute(applicantId: string): Promise<ProjectApplicationResponseDTO[]>;
}
//# sourceMappingURL=GetMyApplicationsUseCase.d.ts.map