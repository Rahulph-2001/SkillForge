import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';
export interface IListSkillTemplatesUseCase {
    execute(adminUserId: string): Promise<SkillTemplate[]>;
    executePublic(): Promise<SkillTemplate[]>;
}
//# sourceMappingURL=IListSkillTemplatesUseCase.d.ts.map