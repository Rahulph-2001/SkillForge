import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IBrowseSkillsUseCase } from './interfaces/IBrowseSkillsUseCase';
import { BrowseSkillsRequestDTO } from '../../dto/skill/BrowseSkillsRequestDTO';
import { BrowseSkillsResponseDTO } from '../../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from '../../mappers/interfaces/IBrowseSkillMapper';

@injectable()
export class BrowseSkillsUseCase implements IBrowseSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IBrowseSkillMapper) private browseSkillMapper: IBrowseSkillMapper
  ) {}

  async execute(filters: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO> {
    const { skills, total } = await this.skillRepository.browse(filters);

    // Collect provider IDs
    const providerIds = [...new Set(skills.map(s => s.providerId))];
    
    // Fetch providers
    const providers = await this.userRepository.findByIds(providerIds);
    const providersMap = new Map(providers.map(p => [p.id, p]));

    const skillDTOs = skills.map(skill => {
      const provider = providersMap.get(skill.providerId);
      if (!provider) {
         throw new Error(`Provider not found for skill ${skill.id}`);
      }
      return this.browseSkillMapper.toDTO(skill, provider);
    });

    const page = filters.page || 1;
    const limit = filters.limit || 12;

    return {
      skills: skillDTOs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
