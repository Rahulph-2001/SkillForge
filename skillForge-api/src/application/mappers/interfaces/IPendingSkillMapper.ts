import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
import { PendingSkillDTO } from '../../dto/admin/PendingSkillDTO';

export interface IPendingSkillMapper {
  toDTO(skill: Skill, provider: User): PendingSkillDTO;
}
