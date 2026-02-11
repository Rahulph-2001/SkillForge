import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';
export interface IGetSkillTemplateByIdUseCase {
    execute(adminUserId: string, templateId: string): Promise<SkillTemplate>;
}
//# sourceMappingURL=IGetSkillTemplateByIdUseCase.d.ts.map