import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IReviewProjectCompletionUseCase, ProjectCompletionDecision } from './interfaces/IReviewProjectCompletionUseCase';
export declare class ReviewProjectCompletionUseCase implements IReviewProjectCompletionUseCase {
    private readonly projectRepository;
    private readonly paymentRequestRepository;
    private readonly applicationRepository;
    constructor(projectRepository: IProjectRepository, paymentRequestRepository: IProjectPaymentRequestRepository, applicationRepository: IProjectApplicationRepository);
    execute(projectId: string, userId: string, decision: ProjectCompletionDecision): Promise<void>;
}
//# sourceMappingURL=ReviewProjectCompletionUseCase.d.ts.map