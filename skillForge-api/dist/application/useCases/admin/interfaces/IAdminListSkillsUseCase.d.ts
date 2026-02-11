import { AdminListSkillsRequestDTO } from '../../../dto/admin/AdminListSkillsRequestDTO';
import { AdminListSkillsResponseDTO } from '../../../dto/admin/AdminListSkillsResponseDTO';
export interface IAdminListSkillsUseCase {
    execute(request: AdminListSkillsRequestDTO): Promise<AdminListSkillsResponseDTO>;
}
//# sourceMappingURL=IAdminListSkillsUseCase.d.ts.map