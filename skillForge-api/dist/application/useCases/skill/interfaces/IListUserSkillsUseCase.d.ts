import { SkillResponseDTO } from '../../../dto/skill/SkillResponseDTO';
export interface ListUserSkillsFilters {
    page?: number;
    limit?: number;
    status?: string;
}
export interface ListUserSkillsResult {
    skills: SkillResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IListUserSkillsUseCase {
    execute(userId: string, filters?: ListUserSkillsFilters): Promise<ListUserSkillsResult>;
}
//# sourceMappingURL=IListUserSkillsUseCase.d.ts.map