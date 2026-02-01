import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IListUserSkillsUseCase, ListUserSkillsFilters, ListUserSkillsResult } from './interfaces/IListUserSkillsUseCase';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';

@injectable()
export class ListUserSkillsUseCase implements IListUserSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.ISkillMapper) private skillMapper: ISkillMapper
  ) { }

  async execute(userId: string, filters: ListUserSkillsFilters = {}): Promise<ListUserSkillsResult> {
    const result = await this.skillRepository.findByProviderIdWithPagination(userId, {
      page: filters.page || 1,
      limit: filters.limit || 12,
      status: filters.status,
    });

    return {
      skills: result.skills.map(skill => this.skillMapper.toResponseDTO(skill)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}