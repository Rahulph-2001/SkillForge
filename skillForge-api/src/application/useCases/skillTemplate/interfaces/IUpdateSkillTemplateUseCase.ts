import { UpdateSkillTemplateDTO } from '../../../dto/skillTemplate/UpdateSkillTemplateDTO';
import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface IUpdateSkillTemplateUseCase {
  execute(adminUserId: string, templateId: string, dto: UpdateSkillTemplateDTO): Promise<SkillTemplate>;
}

