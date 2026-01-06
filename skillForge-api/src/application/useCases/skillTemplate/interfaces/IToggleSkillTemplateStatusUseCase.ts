import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface IToggleSkillTemplateStatusUseCase {
  execute(adminUserId: string, templateId: string): Promise<SkillTemplate>;
}

