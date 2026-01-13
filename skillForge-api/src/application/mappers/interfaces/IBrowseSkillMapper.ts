import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
import { BrowseSkillDTO } from '../../dto/skill/BrowseSkillsResponseDTO';

import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';

export interface IBrowseSkillMapper {
  toDTO(skill: Skill, provider: User, availability?: ProviderAvailability): BrowseSkillDTO;
}
