import { Skill } from '../entities/Skill';
import { BrowseSkillsRequestDTO } from '../../application/dto/skill/BrowseSkillsRequestDTO';
export interface SkillPaginationFilters {
    page?: number;
    limit?: number;
    status?: string;
}
export interface SkillPaginatedResult {
    skills: Skill[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ISkillRepository {
    create(skill: Skill): Promise<Skill>;
    findByProviderId(providerId: string): Promise<Skill[]>;
    findByProviderIdWithPagination(providerId: string, filters: SkillPaginationFilters): Promise<SkillPaginatedResult>;
    findById(id: string): Promise<Skill | null>;
    findAll(filters?: {
        category?: string;
        status?: string;
    }): Promise<Skill[]>;
    findPending(): Promise<Skill[]>;
    browse(filters: BrowseSkillsRequestDTO): Promise<{
        skills: Skill[];
        total: number;
    }>;
    update(skill: Skill): Promise<Skill>;
}
//# sourceMappingURL=ISkillRepository.d.ts.map