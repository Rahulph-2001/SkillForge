import { SkillTemplate } from '../../../../domain/entities/SkillTemplate';

export interface SkillTemplateListResult {
  templates: SkillTemplate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IListSkillTemplatesUseCase {
  execute(
    adminUserId: string,
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    status?: string
  ): Promise<SkillTemplateListResult | SkillTemplate[]>;
  executePublic(): Promise<SkillTemplate[]>;
}