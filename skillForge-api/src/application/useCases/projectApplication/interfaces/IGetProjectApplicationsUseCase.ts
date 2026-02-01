
import { ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';

export interface IGetProjectApplicationsUseCase {
  execute(projectId: string, userId: string): Promise<ProjectApplicationResponseDTO[]>;
}