import { type CreateSkillTemplateDTO } from '../../../dto/skillTemplate/CreateSkillTemplateDTO';
import { type SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface ICreateSkillTemplateUseCase {
  execute(adminUserId: string, dto: CreateSkillTemplateDTO): Promise<SkillTemplate>;
}

