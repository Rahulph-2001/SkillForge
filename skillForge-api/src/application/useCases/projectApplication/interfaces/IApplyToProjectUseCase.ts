
import { ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
import { CreateProjectApplicationDTO } from '../../../dto/projectApplication/CreateProjectApplicationDTO';

export interface IApplyToProjectUseCase {
  execute(applicantId: string, dto: CreateProjectApplicationDTO): Promise<ProjectApplicationResponseDTO>;
}