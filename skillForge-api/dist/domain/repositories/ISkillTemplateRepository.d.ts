import { SkillTemplate } from '../entities/SkillTemplate';
export interface ISkillTemplateRepository {
    create(template: SkillTemplate): Promise<SkillTemplate>;
    findById(id: string): Promise<SkillTemplate | null>;
    findWithPagination(filters: {
        search?: string;
        category?: string;
        status?: string;
    }, pagination: {
        skip: number;
        take: number;
    }): Promise<{
        templates: SkillTemplate[];
        total: number;
    }>;
    findByCategory(category: string): Promise<SkillTemplate[]>;
    findByStatus(status: string): Promise<SkillTemplate[]>;
    update(id: string, template: Partial<SkillTemplate>): Promise<SkillTemplate>;
    delete(id: string): Promise<void>;
    toggleStatus(id: string): Promise<SkillTemplate>;
}
//# sourceMappingURL=ISkillTemplateRepository.d.ts.map