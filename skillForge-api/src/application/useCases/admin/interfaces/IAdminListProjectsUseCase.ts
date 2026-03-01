import { type AdminListProjectsRequestDTO, type AdminListProjectsResponseDTO } from '../../../dto/admin/AdminProjectDTO';

export interface IAdminListProjectsUseCase {
    execute(dto: AdminListProjectsRequestDTO): Promise<AdminListProjectsResponseDTO>;
}
