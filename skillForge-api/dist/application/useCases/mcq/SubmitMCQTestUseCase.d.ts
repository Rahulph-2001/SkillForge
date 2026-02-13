import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { ISubmitMCQTestUseCase } from './interfaces/ISubmitMCQTestUseCase';
import { SubmitMCQRequestDTO } from '../../dto/mcq/SubmitMCQRequestDTO';
import { SubmitMCQResponseDTO } from '../../dto/mcq/SubmitMCQResponseDTO';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
export declare class SubmitMCQTestUseCase implements ISubmitMCQTestUseCase {
    private mcqRepository;
    private skillRepository;
    private adminNotificationService;
    constructor(mcqRepository: IMCQRepository, skillRepository: ISkillRepository, adminNotificationService: IAdminNotificationService);
    execute(request: SubmitMCQRequestDTO): Promise<SubmitMCQResponseDTO>;
}
//# sourceMappingURL=SubmitMCQTestUseCase.d.ts.map