import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ProjectStatus } from '../../../domain/entities/Project';
import { ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';

@injectable()
export class RequestProjectCompletionUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository
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
    }
}
