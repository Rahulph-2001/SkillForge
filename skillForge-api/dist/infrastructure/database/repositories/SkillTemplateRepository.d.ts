import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { Database } from '../Database';
export declare class SkillTemplateRepository implements ISkillTemplateRepository {
    private readonly prisma;
    constructor(db: Database);
    create(template: SkillTemplate): Promise<SkillTemplate>;
    findById(id: string): Promise<SkillTemplate | null>;
    findAll(): Promise<SkillTemplate[]>;
    findByCategory(category: string): Promise<SkillTemplate[]>;
    findByStatus(status: string): Promise<SkillTemplate[]>;
    update(id: string, updates: Partial<SkillTemplate>): Promise<SkillTemplate>;
    delete(id: string): Promise<void>;
    toggleStatus(id: string): Promise<SkillTemplate>;
    private toDomain;
}
//# sourceMappingURL=SkillTemplateRepository.d.ts.map