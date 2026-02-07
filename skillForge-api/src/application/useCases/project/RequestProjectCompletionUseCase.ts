import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ProjectStatus } from '../../../domain/entities/Project';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
import { IRequestProjectCompletionUseCase } from './interfaces/IRequestProjectCompletionUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class RequestProjectCompletionUseCase implements IRequestProjectCompletionUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
    ) { }

    async execute(projectId: string, userId: string): Promise<void> {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        // Verify user is an approved applicant
        const application = await this.applicationRepository.findByProjectAndApplicant(projectId, userId);
        if (!application || application.status !== ProjectApplicationStatus.ACCEPTED) {
            throw new ForbiddenError('Only accepted contributors can request completion');
        }

        if (project.status !== ProjectStatus.IN_PROGRESS) {
            throw new ValidationError('Project must be In Progress to request completion');
        }

        project.markAsPendingCompletion();

        await this.projectRepository.update(project);

        // Notify project owner about completion request
        const contributor = await this.userRepository.findById(userId);

        await this.notificationService.send({
            userId: project.clientId,
            type: NotificationType.PROJECT_COMPLETION_REQUESTED,
            title: 'Project Completion Requested',
            message: `${contributor?.name || 'Contributor'} marked "${project.title}" as completed and is requesting your approval`,
            data: {
                projectId: project.id!,
                contributorId: userId
            },
        });
    }
}
