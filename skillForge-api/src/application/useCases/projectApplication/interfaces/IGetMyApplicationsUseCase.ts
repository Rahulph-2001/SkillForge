
import { type ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';

export interface IGetMyApplicationsUseCase {
  execute(applicantId: string): Promise<ProjectApplicationResponseDTO[]>;
}