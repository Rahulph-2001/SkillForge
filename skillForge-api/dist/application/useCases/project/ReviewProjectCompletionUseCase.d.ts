import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IReviewProjectCompletionUseCase, ProjectCompletionDecision } from './interfaces/IReviewProjectCompletionUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class ReviewProjectCompletionUseCase implements IReviewProjectCompletionUseCase {
    private readonly projectRepository;
    private readonly paymentRequestRepository;
    private readonly applicationRepository;
    private readonly notificationService;
    constructor(projectRepository: IProjectRepository, paymentRequestRepository: IProjectPaymentRequestRepository, applicationRepository: IProjectApplicationRepository, notificationService: INotificationService);
    execute(projectId: string, userId: string, decision: ProjectCompletionDecision, reason?: string): Promise<void>;
}
//# sourceMappingURL=ReviewProjectCompletionUseCase.d.ts.map