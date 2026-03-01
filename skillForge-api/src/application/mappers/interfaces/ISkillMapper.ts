import { type Skill } from '../../../domain/entities/Skill';
import { type SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';

export interface ISkillMapper {
  toResponseDTO(skill: Skill): SkillResponseDTO;
}
