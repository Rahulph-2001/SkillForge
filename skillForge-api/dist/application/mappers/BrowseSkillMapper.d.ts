import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { ProviderAvailability } from '../../domain/entities/ProviderAvailability';
import { BrowseSkillDTO } from '../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from './interfaces/IBrowseSkillMapper';
export declare class BrowseSkillMapper implements IBrowseSkillMapper {
    toDTO(skill: Skill, provider: User, availability?: ProviderAvailability): BrowseSkillDTO;
}
//# sourceMappingURL=BrowseSkillMapper.d.ts.map