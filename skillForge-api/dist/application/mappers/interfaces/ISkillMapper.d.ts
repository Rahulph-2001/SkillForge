import { Skill } from '../../../domain/entities/Skill';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
export interface ISkillMapper {
    toResponseDTO(skill: Skill): SkillResponseDTO;
}
//# sourceMappingURL=ISkillMapper.d.ts.map