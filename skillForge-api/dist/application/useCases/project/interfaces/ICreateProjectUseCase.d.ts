import { CreateProjectRequestDTO } from '../../../dto/project/CreateProjectDTO';
import { ProjectResponseDTO } from '../../../dto/project/ProjectResponseDTO';
export interface ICreateProjectUseCase {
    execute(userId: string, request: CreateProjectRequestDTO, paymentId?: string): Promise<ProjectResponseDTO>;
}
//# sourceMappingURL=ICreateProjectUseCase.d.ts.map