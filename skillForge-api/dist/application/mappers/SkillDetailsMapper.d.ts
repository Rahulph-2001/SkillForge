import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { SkillDetailsDTO } from '../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from './interfaces/ISkillDetailsMapper';
export declare class SkillDetailsMapper implements ISkillDetailsMapper {
    toDTO(skill: Skill, provider: User, providerStats: {
        rating: number;
        reviewCount: number;
    }, availability?: any): SkillDetailsDTO;
}
//# sourceMappingURL=SkillDetailsMapper.d.ts.map