import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IListSkillTemplatesUseCase, SkillTemplateListResult } from './interfaces/IListSkillTemplatesUseCase';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';

@injectable()
export class ListSkillTemplatesUseCase implements IListSkillTemplatesUseCase {
  constructor(
    @inject(TYPES.ISkillTemplateRepository)
    private readonly skillTemplateRepository: ISkillTemplateRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IPaginationService)
    private readonly paginationService: IPaginationService
  ) { }

  async execute(
    adminUserId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    status?: string
  ): Promise<SkillTemplateListResult> {
    // Verify admin
    const admin = await this.userRepository.findById(adminUserId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can view skill templates');
    }

    const paginationParams = this.paginationService.createParams(page, limit);

    const { templates, total } = await this.skillTemplateRepository.findWithPagination(
      { search, category, status },
      paginationParams
    );

    const paginationResult = this.paginationService.createResult(
      templates,
      total,
      page,
      limit
    );

    return {
      templates,
      pagination: {
        total: paginationResult.total,
        page: paginationResult.page,
        limit: paginationResult.limit,
        totalPages: paginationResult.totalPages,
        hasNextPage: paginationResult.hasNextPage,
        hasPreviousPage: paginationResult.hasPreviousPage,
      },
    };
  }

  async executePublic(): Promise<SkillTemplate[]> {
   
    return await this.skillTemplateRepository.findByStatus('Active');
  }
}