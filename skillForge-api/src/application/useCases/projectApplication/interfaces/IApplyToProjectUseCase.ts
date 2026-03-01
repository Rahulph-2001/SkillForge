
import { type ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
import { type CreateProjectApplicationDTO } from '../../../dto/projectApplication/CreateProjectApplicationDTO';

export interface IApplyToProjectUseCase {
  execute(applicantId: string, dto: CreateProjectApplicationDTO): Promise<ProjectApplicationResponseDTO>;
}