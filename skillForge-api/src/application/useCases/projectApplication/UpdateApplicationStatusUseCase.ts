import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUpdateApplicationStatusUseCase } from './interfaces/IUpdateApplicationStatusUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class UpdateApplicationStatusUseCase implements IUpdateApplicationStatusUseCase {
  constructor(
    @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.IProjectApplicationMapper) private readonly mapper: IProjectApplicationMapper,
    @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
  ) { }

  async execute(
    applicationId: string,
    clientId: string,
    status: ProjectApplicationStatus
  ): Promise<ProjectApplicationResponseDTO> {
    // 1. Get application
    const application = await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // 2. Validate project ownership
    const project = await this.projectRepository.findById(application.projectId);
    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
    }
    if (project.clientId !== clientId) {
      throw new ForbiddenError('Only the project owner can update application status');
    }

    // 3. Apply status change based on domain logic
    switch (status) {
      case ProjectApplicationStatus.SHORTLISTED:
        application.shortlist();
        break;
      case ProjectApplicationStatus.ACCEPTED:
        application.accept();
        // Automatically start the project if it's open
        if (project.status === 'Open') {
          try {
            project.markAsInProgress();
            await this.projectRepository.update(project);
          } catch (error) {
            console.warn(`[UpdateApplicationStatus] Could not mark project as in-progress: ${error}`);
          }
        }
        break;
      case ProjectApplicationStatus.REJECTED:
        application.reject();
        break;
      default:
        throw new ValidationError('Invalid status update');
    }

    // 4. Save updated application
    const updated = await this.applicationRepository.update(application);

    // 5. Send notification to applicant based on status
    if (status === ProjectApplicationStatus.ACCEPTED) {
      await this.notificationService.send({
        userId: application.applicantId,
        type: NotificationType.PROJECT_APPLICATION_ACCEPTED,
        title: 'Application Accepted!',
        message: `Congratulations! Your application to "${project.title}" has been accepted!`,
        data: {
          projectId: project.id!,
          applicationId: application.id!,
          status: 'ACCEPTED'
        },
      });
    } else if (status === ProjectApplicationStatus.REJECTED) {
      await this.notificationService.send({
        userId: application.applicantId,
        type: NotificationType.PROJECT_APPLICATION_REJECTED,
        title: 'Application Update',
        message: `Your application to "${project.title}" was not accepted`,
        data: {
          projectId: project.id!,
          applicationId: application.id!,
          status: 'REJECTED'
        },
      });
    } else if (status === ProjectApplicationStatus.SHORTLISTED) {
      await this.notificationService.send({
        userId: application.applicantId,
        type: NotificationType.PROJECT_APPLICATION_RECEIVED,
        title: 'Application Shortlisted',
        message: `Your application to "${project.title}" has been shortlisted!`,
        data: {
          projectId: project.id!,
          applicationId: application.id!,
          status: 'SHORTLISTED'
        },
      });
    }

    return this.mapper.toResponseDTO(updated);
  }
}