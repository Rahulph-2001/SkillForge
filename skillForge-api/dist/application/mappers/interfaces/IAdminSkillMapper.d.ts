import { AdminSkillDTO } from '../../dto/admin/AdminSkillDTO';
import { Skill } from '../../../domain/entities/Skill';
import { User } from '../../../domain/entities/User';
export interface IAdminSkillMapper {
    toDTO(skill: Skill, provider: User): AdminSkillDTO;
}
//# sourceMappingURL=IAdminSkillMapper.d.ts.map