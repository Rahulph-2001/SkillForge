import { type CreateProjectRequestDTO } from '../../../dto/project/CreateProjectDTO';
import { type ProjectResponseDTO } from '../../../dto/project/ProjectResponseDTO';

export interface ICreateProjectUseCase {
  execute(userId: string, request: CreateProjectRequestDTO, paymentId?: string): Promise<ProjectResponseDTO>;
}

