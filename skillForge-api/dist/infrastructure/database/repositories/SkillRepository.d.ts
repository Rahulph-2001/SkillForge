import { ISkillRepository, BrowseSkillsFilters } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class SkillRepository extends BaseRepository<Skill> implements ISkillRepository {
    constructor(db: Database);
    browse(filters: BrowseSkillsFilters): Promise<{
        skills: Skill[];
        total: number;
    }>;
    findPending(): Promise<Skill[]>;
    findById(id: string): Promise<Skill | null>;
    findByProviderId(providerId: string): Promise<Skill[]>;
    findByProviderIdWithPagination(providerId: string, filters: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        skills: Skill[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByProviderIdAndStatus(providerId: string, status: string): Promise<Skill[]>;
    findAll(): Promise<Skill[]>;
    create(skill: Skill): Promise<Skill>;
    update(skill: Skill): Promise<Skill>;
    delete(id: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=SkillRepository.d.ts.map