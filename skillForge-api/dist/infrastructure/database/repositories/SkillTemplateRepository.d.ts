import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class SkillTemplateRepository extends BaseRepository<SkillTemplate> implements ISkillTemplateRepository {
    constructor(db: Database);
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
    update(id: string, updates: Partial<SkillTemplate>): Promise<SkillTemplate>;
    delete(id: string): Promise<void>;
    toggleStatus(id: string): Promise<SkillTemplate>;
    private toDomain;
}
//# sourceMappingURL=SkillTemplateRepository.d.ts.map