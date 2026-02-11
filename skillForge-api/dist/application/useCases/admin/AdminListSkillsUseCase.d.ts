import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAdminSkillMapper } from '../../mappers/interfaces/IAdminSkillMapper';
import { IAdminListSkillsUseCase } from './interfaces/IAdminListSkillsUseCase';
import { AdminListSkillsRequestDTO } from '../../dto/admin/AdminListSkillsRequestDTO';
import { AdminListSkillsResponseDTO } from '../../dto/admin/AdminListSkillsResponseDTO';
export declare class AdminListSkillsUseCase implements IAdminListSkillsUseCase {
    private userRepository;
    private skillRepository;
    private adminSkillMapper;
    constructor(userRepository: IUserRepository, skillRepository: ISkillRepository, adminSkillMapper: IAdminSkillMapper);
    execute(request: AdminListSkillsRequestDTO): Promise<AdminListSkillsResponseDTO>;
}
//# sourceMappingURL=AdminListSkillsUseCase.d.ts.map