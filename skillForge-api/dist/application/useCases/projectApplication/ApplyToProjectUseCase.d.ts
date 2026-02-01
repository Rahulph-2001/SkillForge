import { IApplyToProjectUseCase } from './interfaces/IApplyToProjectUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IGeminiAIService } from '../../../domain/services/IGeminiAIService';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { CreateProjectApplicationDTO } from '../../dto/projectApplication/CreateProjectApplicationDTO';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
export declare class ApplyToProjectUseCase implements IApplyToProjectUseCase {
    private readonly applicationRepository;
    private readonly projectRepository;
    private readonly userRepository;
    private readonly skillRepository;
    private readonly geminiService;
    private readonly mapper;
    constructor(applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, userRepository: IUserRepository, skillRepository: ISkillRepository, geminiService: IGeminiAIService, mapper: IProjectApplicationMapper);
    execute(applicantId: string, dto: CreateProjectApplicationDTO): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=ApplyToProjectUseCase.d.ts.map