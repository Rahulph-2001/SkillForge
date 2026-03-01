import { type Skill } from '../../../domain/entities/Skill';
import { type User } from '../../../domain/entities/User';
import { type PendingSkillDTO } from '../../dto/admin/PendingSkillDTO';

export interface IPendingSkillMapper {
  toDTO(skill: Skill, provider: User): PendingSkillDTO;
}
