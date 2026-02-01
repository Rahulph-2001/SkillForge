
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProjectApplicationsUseCase } from './interfaces/IGetProjectApplicationsUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class GetProjectApplicationsUseCase implements IGetProjectApplicationsUseCase {
  constructor(
    @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository, // Using ISkillRepository (any generic repository injection needed? No, wait)
    // Wait, I need to fetch applicant details? The mapper handles converting entity to DTO.
    // Entity likely has applicant relation loaded or I need to fetch.
    // Let's assume Repository returns populated entities or I fetch.
    // Repository findByProjectId should return populated entities.
    @inject(TYPES.IProjectApplicationMapper) private readonly mapper: IProjectApplicationMapper
  ) { }

  async execute(projectId: string, userId: string): Promise<ProjectApplicationResponseDTO[]> {
    // 1. Verify project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
    }

    // 2. Verify ownership
    if (project.clientId !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.PROJECT_APPLICATION.UNAUTHORIZED);
    }

    // 3. Get applications
    const applications = await this.applicationRepository.findByProjectId(projectId);

    // 4. Map to DTO
    // The mapper likely expects entities. If entities have applicant relation loaded, good.
    // If not, I might need to fetch user details.
    // Let's check IProjectApplicationMapper usage in ApplyToProjectUseCase (step 1072).
    // It accepts (savedApplication, userDetails).
    // Here we have a list.
    // IProjectApplicationMapper should have toResponseDTOList or similar that handles relations.
    // Typically mappers handle this if entity has the data.
    // IProjectApplicationRepository.findByProjectId implementation in step 1075 (wait, I implemented UseCase, not Repos).
    // I need to ensure Repository fetches relations.

    return this.mapper.toResponseDTOList(applications);
  }
}
// Note: I included ISkillRepository import but didn't use it, remove it.
// Also, ISkillRepository was not in constructor.