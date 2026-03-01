import { type ProjectResponseDTO } from '../../../dto/project/ProjectResponseDTO';

export interface IGetProjectUseCase {
    execute(projectId: string): Promise<ProjectResponseDTO>;
}
