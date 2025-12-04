import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';

export interface ISkillDetailsMapper {
  toDTO(skill: Skill, provider: User, providerStats: { rating: number; reviewCount: number }): SkillDetailsDTO;
}
