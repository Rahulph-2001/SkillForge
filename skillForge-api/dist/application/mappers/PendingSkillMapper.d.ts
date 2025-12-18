import { PendingSkillDTO } from '../dto/admin/PendingSkillDTO';
import { IPendingSkillMapper } from './interfaces/IPendingSkillMapper';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
export declare class PendingSkillMapper implements IPendingSkillMapper {
    toDTO(skill: Skill, provider: User): PendingSkillDTO;
}
//# sourceMappingURL=PendingSkillMapper.d.ts.map