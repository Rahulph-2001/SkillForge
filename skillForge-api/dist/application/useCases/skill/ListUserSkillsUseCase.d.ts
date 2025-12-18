import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IListUserSkillsUseCase } from './interfaces/IListUserSkillsUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';
export declare class ListUserSkillsUseCase implements IListUserSkillsUseCase {
    private skillRepository;
    private skillMapper;
    constructor(skillRepository: ISkillRepository, skillMapper: ISkillMapper);
    execute(userId: string): Promise<SkillResponseDTO[]>;
}
//# sourceMappingURL=ListUserSkillsUseCase.d.ts.map