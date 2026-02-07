import { AdminProjectDetailsDTO } from '../../../dto/admin/AdminProjectDetailsDTO';
export interface IAdminGetProjectDetailsUseCase {
    execute(projectId: string): Promise<AdminProjectDetailsDTO>;
}
//# sourceMappingURL=IAdminGetProjectDetailsUseCase.d.ts.map