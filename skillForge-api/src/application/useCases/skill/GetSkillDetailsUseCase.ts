import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetSkillDetailsUseCase } from './interfaces/IGetSkillDetailsUseCase';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from '../../mappers/interfaces/ISkillDetailsMapper';

@injectable()
export class GetSkillDetailsUseCase implements IGetSkillDetailsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ISkillDetailsMapper) private skillDetailsMapper: ISkillDetailsMapper
  ) {}

  async execute(skillId: string): Promise<SkillDetailsDTO> {
    // Fetch skill
    const skill = await this.skillRepository.findById(skillId);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // Only show approved, verified, non-blocked, non-deleted skills
    if (
      skill.status !== 'approved' ||
      skill.verificationStatus !== 'passed' ||
      skill.isBlocked
    ) {
      throw new NotFoundError('Skill not available');
    }

    // Fetch provider
    const provider = await this.userRepository.findById(skill.providerId);
    if (!provider) {
        throw new NotFoundError('Provider not found');
    }

    // Calculate provider stats from all their skills
    const providerSkills = await this.skillRepository.findByProviderId(skill.providerId);
    
    // Filter for valid skills for stats
    const validSkills = providerSkills.filter(s => 
        s.status === 'approved' && 
        s.verificationStatus === 'passed' && 
        !s.isBlocked
    );

    const providerTotalRating = validSkills.reduce(
      (sum, s) => sum + (s.rating || 0),
      0
    );
    const providerAverageRating =
      validSkills.length > 0 ? providerTotalRating / validSkills.length : 0;
    
    const providerTotalSessions = validSkills.reduce(
      (sum, s) => sum + (s.totalSessions || 0),
      0
    );

    return this.skillDetailsMapper.toDTO(skill, provider, {
        rating: Number(providerAverageRating.toFixed(1)),
        reviewCount: providerTotalSessions
    });
  }
}
