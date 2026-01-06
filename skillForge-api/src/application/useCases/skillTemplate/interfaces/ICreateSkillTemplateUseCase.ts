import { CreateSkillTemplateDTO } from '../../../dto/skillTemplate/CreateSkillTemplateDTO';
import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface ICreateSkillTemplateUseCase {
  execute(adminUserId: string, dto: CreateSkillTemplateDTO): Promise<SkillTemplate>;
}

