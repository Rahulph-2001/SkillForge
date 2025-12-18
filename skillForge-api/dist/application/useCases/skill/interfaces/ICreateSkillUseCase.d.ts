import { CreateSkillDTO } from '../../../dto/skill/CreateSkillDTO';
import { SkillResponseDTO } from '../../../dto/skill/SkillResponseDTO';
export interface ICreateSkillUseCase {
    execute(userId: string, data: CreateSkillDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<SkillResponseDTO>;
}
//# sourceMappingURL=ICreateSkillUseCase.d.ts.map