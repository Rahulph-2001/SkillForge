import { Skill } from '../../domain/entities/Skill';
import { SkillResponseDTO } from '../dto/skill/SkillResponseDTO';
import { ISkillMapper } from './interfaces/ISkillMapper';
export declare class SkillMapper implements ISkillMapper {
    toResponseDTO(skill: Skill): SkillResponseDTO;
}
//# sourceMappingURL=SkillMapper.d.ts.map