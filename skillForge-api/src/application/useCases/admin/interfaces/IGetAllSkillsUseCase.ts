import { SkillDTO } from '../GetAllSkillsUseCase';

export interface IGetAllSkillsUseCase {
  execute(): Promise<SkillDTO[]>;
}

