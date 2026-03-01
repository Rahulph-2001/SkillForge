import { type Skill } from '../../../domain/entities/Skill';
import { type User } from '../../../domain/entities/User';
import { type ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
import { type SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';

export interface ISkillDetailsMapper {
  toDTO(skill: Skill, provider: User, providerStats: { rating: number; reviewCount: number }, availability?: ProviderAvailability): SkillDetailsDTO;
}
