import { AdminListProjectsRequestDTO, AdminListProjectsResponseDTO } from '../../../dto/admin/AdminProjectDTO';

export interface IAdminListProjectsUseCase {
    execute(dto: AdminListProjectsRequestDTO): Promise<AdminListProjectsResponseDTO>;
}
