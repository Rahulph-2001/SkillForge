import { type UpdateSkillTemplateDTO } from '../../../dto/skillTemplate/UpdateSkillTemplateDTO';
import { type SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface IUpdateSkillTemplateUseCase {
  execute(adminUserId: string, templateId: string, dto: UpdateSkillTemplateDTO): Promise<SkillTemplate>;
}

