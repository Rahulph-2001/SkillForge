import { type Skill } from '../../../domain/entities/Skill';
import { type User } from '../../../domain/entities/User';
import { type BrowseSkillDTO } from '../../dto/skill/BrowseSkillsResponseDTO';

import { type ProviderAvailability } from '../../../domain/entities/ProviderAvailability';

export interface IBrowseSkillMapper {
  toDTO(skill: Skill, provider: User, availability?: ProviderAvailability): BrowseSkillDTO;
}
