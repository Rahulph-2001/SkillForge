import { type AdminSkillDTO } from '../../dto/admin/AdminSkillDTO';
import { type Skill } from '../../../domain/entities/Skill';
import { type User } from '../../../domain/entities/User';

export interface IAdminSkillMapper {
    toDTO(skill: Skill, provider: User): AdminSkillDTO;
}
