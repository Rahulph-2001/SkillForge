import { IStartMCQImportUseCase } from './interfaces/IStartMCQImportUseCase';
import { StartMCQImportRequestDTO, StartMCQImportResponseDTO } from '../../dto/mcq/StartMCQImportDTO';
import { IS3Service } from '../../../domain/services/IS3Service';
import { IJobQueueService } from '../../../domain/services/IJobQueueService';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
export declare class StartMCQImportUseCase implements IStartMCQImportUseCase {
    private userRepository;
    private templateRepository;
    private s3Service;
    private jobRepository;
    private jobQueueService;
    constructor(userRepository: IUserRepository, templateRepository: ISkillTemplateRepository, s3Service: IS3Service, jobRepository: IMCQImportJobRepository, jobQueueService: IJobQueueService);
    execute(request: StartMCQImportRequestDTO, file: Express.Multer.File): Promise<StartMCQImportResponseDTO>;
    private countRows;
}
//# sourceMappingURL=StartMCQImportUseCase.d.ts.map