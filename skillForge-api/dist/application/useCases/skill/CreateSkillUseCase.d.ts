import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { CreateSkillDTO } from '../../dto/skill/CreateSkillDTO';
import { ICreateSkillUseCase } from './interfaces/ICreateSkillUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
export declare class CreateSkillUseCase implements ICreateSkillUseCase {
    private skillRepository;
    private storageService;
    private skillMapper;
    private adminNotificationService;
    constructor(skillRepository: ISkillRepository, storageService: IStorageService, skillMapper: ISkillMapper, adminNotificationService: IAdminNotificationService);
    execute(userId: string, data: CreateSkillDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<SkillResponseDTO>;
}
//# sourceMappingURL=CreateSkillUseCase.d.ts.map