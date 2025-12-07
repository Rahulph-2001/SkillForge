import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListPendingSkillsUseCase } from './interfaces/IListPendingSkillsUseCase';
import { ListPendingSkillsResponseDTO } from '../../dto/admin/ListPendingSkillsResponseDTO';
import { IPendingSkillMapper } from '../../mappers/interfaces/IPendingSkillMapper';
export declare class ListPendingSkillsUseCase implements IListPendingSkillsUseCase {
    private skillRepository;
    private userRepository;
    private pendingSkillMapper;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, pendingSkillMapper: IPendingSkillMapper);
    execute(): Promise<ListPendingSkillsResponseDTO>;
}
//# sourceMappingURL=ListPendingSkillsUseCase.d.ts.map