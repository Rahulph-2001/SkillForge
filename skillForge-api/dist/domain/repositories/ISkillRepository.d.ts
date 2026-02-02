import { Skill } from '../entities/Skill';
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
/**
 * Domain-level filter interface for browsing skills
 * This keeps the domain layer independent of the application layer
 */
export interface BrowseSkillsFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    level?: string;
    minCredits?: number;
    maxCredits?: number;
    sortBy?: 'rating' | 'credits' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    excludeProviderId?: string;
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
    browse(filters: BrowseSkillsFilters): Promise<{
        skills: Skill[];
        total: number;
    }>;
    update(skill: Skill): Promise<Skill>;
}
//# sourceMappingURL=ISkillRepository.d.ts.map