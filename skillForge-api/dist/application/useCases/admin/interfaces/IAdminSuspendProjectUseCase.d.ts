import { AdminSuspendProjectRequestDTO, AdminSuspendProjectResponseDTO } from '../../../dto/admin/AdminSuspendProjectDTO';
export interface IAdminSuspendProjectUseCase {
    execute(projectId: string, dto: AdminSuspendProjectRequestDTO, adminId: string): Promise<AdminSuspendProjectResponseDTO>;
}
//# sourceMappingURL=IAdminSuspendProjectUseCase.d.ts.map