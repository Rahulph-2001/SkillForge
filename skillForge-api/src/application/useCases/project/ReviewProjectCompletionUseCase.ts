import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ProjectStatus } from '../../../domain/entities/Project';

@injectable()
export class ReviewProjectCompletionUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository
    ) { }

    async execute(projectId: string, userId: string, decision: 'APPROVE' | 'REJECT'): Promise<void> {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.clientId !== userId) {
            throw new ForbiddenError('Only the project owner can review completion');
        }

        // Status check logic is handled inside the entity methods now

        if (decision === 'APPROVE') {
            project.markAsCompleted();
            // Handle payment release logic here (Escrow release) - usually via dedicated service
            // For now, we update status. EscrowService call should be added if integrated.
        } else if (decision === 'REJECT') {
            project.requestModifications(); // Assuming REJECT means back to In Progress
        } else {
            throw new ValidationError('Invalid decision');
        }

        await this.projectRepository.update(project);
    }
}
