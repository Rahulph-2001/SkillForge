
import { type ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
import { type ProjectApplicationStatus } from '../../../../domain/entities/ProjectApplication';

export interface IUpdateApplicationStatusUseCase {
  execute(applicationId: string, clientId: string, status: ProjectApplicationStatus): Promise<ProjectApplicationResponseDTO>;
}