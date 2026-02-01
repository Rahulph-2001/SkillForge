import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IReviewProjectCompletionUseCase, ProjectCompletionDecision } from './interfaces/IReviewProjectCompletionUseCase';
import { ProjectPaymentRequest, ProjectPaymentRequestType, ProjectPaymentRequestStatus } from '../../../domain/entities/ProjectPaymentRequest';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class ReviewProjectCompletionUseCase implements IReviewProjectCompletionUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository,
        @inject(TYPES.IProjectApplicationRepository) private readonly applicationRepository: IProjectApplicationRepository
    ) { }

    async execute(projectId: string, userId: string, decision: ProjectCompletionDecision): Promise<void> {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError('Project not found');
        }

        if (project.clientId !== userId) {
            throw new ForbiddenError('Only the project owner can review completion');
        }

        // Get accepted contributor to pay
        const application = await this.applicationRepository.findAcceptedByProject(projectId);
        if (!application) {
            throw new NotFoundError('No accepted contributor found for this project');
        }

        if (decision === 'APPROVE') {
            // Create RELEASE payment request pending admin approval
            const paymentRequest = ProjectPaymentRequest.create({
                id: uuidv4(),
                projectId: project.id!,
                type: ProjectPaymentRequestType.RELEASE,
                amount: project.budget,
                requestedBy: userId,
                recipientId: application.applicantId,
                status: ProjectPaymentRequestStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await this.paymentRequestRepository.create(paymentRequest);
            project.markAsPaymentPending();

        } else if (decision === 'REJECT') {
            // Create REFUND payment request pending admin approval
            const paymentRequest = ProjectPaymentRequest.create({
                id: uuidv4(),
                projectId: project.id!,
                type: ProjectPaymentRequestType.REFUND,
                amount: project.budget,
                requestedBy: userId,
                recipientId: userId, // Refund back to creator
                status: ProjectPaymentRequestStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await this.paymentRequestRepository.create(paymentRequest);
            project.markAsRefundPending();
        } else if (decision === 'REQUEST_CHANGES') {
            project.requestModifications();
        } else {
            throw new ValidationError('Invalid decision');
        }

        await this.projectRepository.update(project);
    }
}
