import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IBrowseSkillsUseCase } from './interfaces/IBrowseSkillsUseCase';
import { BrowseSkillsRequestDTO } from '../../dto/skill/BrowseSkillsRequestDTO';
import { BrowseSkillsResponseDTO } from '../../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from '../../mappers/interfaces/IBrowseSkillMapper';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class BrowseSkillsUseCase implements IBrowseSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAvailabilityRepository) private availabilityRepository: IAvailabilityRepository,
    @inject(TYPES.IBrowseSkillMapper) private browseSkillMapper: IBrowseSkillMapper,
    @inject(TYPES.IPaginationService) private paginationService: IPaginationService
  ) { }

  async execute(filters: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO> {
    const paginationParams = this.paginationService.createParams(filters.page || 1, filters.limit || 12);

    // Update filters with validated params
    const queryFilters = {
      ...filters,
      page: paginationParams.page,
      limit: paginationParams.limit
    };

    const { skills, total } = await this.skillRepository.browse(queryFilters);

    // Collect provider IDs
    const providerIds = [...new Set(skills.map(s => s.providerId))];

    // Fetch providers
    const providers = await this.userRepository.findByIds(providerIds);
    const providersMap = new Map(providers.map(p => [p.id, p]));

    // Fetch availability
    const availabilities = await this.availabilityRepository.findByProviderIds(providerIds);
    const availabilityMap = new Map(availabilities.map(a => [a.providerId, a]));

    const skillDTOs = skills.map(skill => {
      const provider = providersMap.get(skill.providerId);
      if (!provider) {
        throw new NotFoundError(`Provider not found for skill ${skill.id}`);
      }
      const availability = availabilityMap.get(skill.providerId);
      return this.browseSkillMapper.toDTO(skill, provider, availability);
    });

    const paginationResult = this.paginationService.createResult(
      skillDTOs,
      total,
      paginationParams.page,
      paginationParams.limit
    );

    return {
      skills: paginationResult.data,
      total: paginationResult.total,
      page: paginationResult.page,
      limit: paginationResult.limit,
      totalPages: paginationResult.totalPages
    };
  }
}
