import { SkillResponseDTO } from '../../../dto/skill/SkillResponseDTO';

export interface IListUserSkillsUseCase {
  execute(userId: string): Promise<SkillResponseDTO[]>;
}
