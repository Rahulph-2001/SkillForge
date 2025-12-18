import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { CreateSkillDTO } from '../../dto/skill/CreateSkillDTO';
import { ICreateSkillUseCase } from './interfaces/ICreateSkillUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';
export declare class CreateSkillUseCase implements ICreateSkillUseCase {
    private skillRepository;
    private s3Service;
    private skillMapper;
    constructor(skillRepository: ISkillRepository, s3Service: IS3Service, skillMapper: ISkillMapper);
    execute(userId: string, data: CreateSkillDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<SkillResponseDTO>;
}
//# sourceMappingURL=CreateSkillUseCase.d.ts.map