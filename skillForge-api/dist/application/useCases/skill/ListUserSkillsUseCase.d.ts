import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IListUserSkillsUseCase, ListUserSkillsFilters, ListUserSkillsResult } from './interfaces/IListUserSkillsUseCase';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';
export declare class ListUserSkillsUseCase implements IListUserSkillsUseCase {
    private skillRepository;
    private skillMapper;
    constructor(skillRepository: ISkillRepository, skillMapper: ISkillMapper);
    execute(userId: string, filters?: ListUserSkillsFilters): Promise<ListUserSkillsResult>;
}
//# sourceMappingURL=ListUserSkillsUseCase.d.ts.map