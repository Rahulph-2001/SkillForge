import { type CreateSkillDTO } from '../../../dto/skill/CreateSkillDTO';
import { type SkillResponseDTO } from '../../../dto/skill/SkillResponseDTO';

export interface ICreateSkillUseCase {
  execute(
    userId: string, 
    data: CreateSkillDTO, 
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<SkillResponseDTO>;
}
