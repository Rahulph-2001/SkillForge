import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { IS3Service } from '../../../domain/services/IS3Service';
export interface UpdateSkillDTO {
    description?: string;
    category?: string;
    level?: string;
    durationHours?: number;
    creditsPerHour?: number;
    tags?: string[];
    imageUrl?: string;
}
export interface IUpdateSkillUseCase {
    execute(skillId: string, providerId: string, updates: UpdateSkillDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Skill>;
}
export declare class UpdateSkillUseCase implements IUpdateSkillUseCase {
    private skillRepository;
    private s3Service;
    constructor(skillRepository: ISkillRepository, s3Service: IS3Service);
    execute(skillId: string, providerId: string, updates: UpdateSkillDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Skill>;
}
//# sourceMappingURL=UpdateSkillUseCase.d.ts.map