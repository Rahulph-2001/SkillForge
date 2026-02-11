import { AdminSkillDTO } from '../dto/admin/AdminSkillDTO';
import { IAdminSkillMapper } from './interfaces/IAdminSkillMapper';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
export declare class AdminSkillMapper implements IAdminSkillMapper {
    toDTO(skill: Skill, provider: User): AdminSkillDTO;
}
//# sourceMappingURL=AdminSkillMapper.d.ts.map