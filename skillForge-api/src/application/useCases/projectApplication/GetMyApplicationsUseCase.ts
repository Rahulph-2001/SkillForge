
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetMyApplicationsUseCase } from './interfaces/IGetMyApplicationsUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';

@injectable()
export class GetMyApplicationsUseCase implements IGetMyApplicationsUseCase {
  constructor(
    @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectApplicationMapper) private readonly mapper: IProjectApplicationMapper
  ) { }

  async execute(applicantId: string): Promise<ProjectApplicationResponseDTO[]> {
    const applications = await this.applicationRepository.findByApplicantId(applicantId);
    return this.mapper.toResponseDTOList(applications);
  }
}