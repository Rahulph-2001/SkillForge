
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IWithdrawApplicationUseCase } from './interfaces/IWithdrawApplicationUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class WithdrawApplicationUseCase implements IWithdrawApplicationUseCase {
  constructor(
    @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectApplicationMapper) private readonly mapper: IProjectApplicationMapper
  ) { }

  async execute(applicationId: string, applicantId: string): Promise<ProjectApplicationResponseDTO> {
    const application = await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    if (application.applicantId !== applicantId) {
      throw new ForbiddenError('You can only withdraw your own applications');
    }

    application.withdraw();
    const updated = await this.applicationRepository.update(application);
    return this.mapper.toResponseDTO(updated);
  }
}