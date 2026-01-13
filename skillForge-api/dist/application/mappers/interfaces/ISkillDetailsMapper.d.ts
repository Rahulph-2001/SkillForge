import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
import { ProviderAvailability } from '../../../domain/entities/ProviderAvailability';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';
export interface ISkillDetailsMapper {
    toDTO(skill: Skill, provider: User, providerStats: {
        rating: number;
        reviewCount: number;
    }, availability?: ProviderAvailability): SkillDetailsDTO;
}
//# sourceMappingURL=ISkillDetailsMapper.d.ts.map