import { AdminSuspendProjectRequestDTO, AdminSuspendProjectResponseDTO } from '../../../dto/admin/AdminSuspendProjectDTO';

export interface IAdminSuspendProjectUseCase {
  execute(projectId: string, dto: AdminSuspendProjectRequestDTO, adminId: string): Promise<AdminSuspendProjectResponseDTO>;
}