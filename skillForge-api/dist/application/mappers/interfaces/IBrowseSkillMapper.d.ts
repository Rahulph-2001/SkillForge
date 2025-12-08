import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
import { BrowseSkillDTO } from '../../dto/skill/BrowseSkillsResponseDTO';
export interface IBrowseSkillMapper {
    toDTO(skill: Skill, provider: User, availability?: any): BrowseSkillDTO;
}
//# sourceMappingURL=IBrowseSkillMapper.d.ts.map