import { type AdminListSkillsRequestDTO } from '../../../dto/admin/AdminListSkillsRequestDTO';
import { type AdminListSkillsResponseDTO } from '../../../dto/admin/AdminListSkillsResponseDTO';

export interface IAdminListSkillsUseCase {
    execute(request: AdminListSkillsRequestDTO): Promise<AdminListSkillsResponseDTO>;
}
