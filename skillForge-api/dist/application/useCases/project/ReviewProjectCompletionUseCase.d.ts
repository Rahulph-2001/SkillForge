import { IApproveProjectCompletionUseCase } from './interfaces/IApproveProjectCompletionUseCase';
import { IRejectProjectCompletionUseCase } from './interfaces/IRejectProjectCompletionUseCase';
import { IReviewProjectCompletionUseCase } from './interfaces/IReviewProjectCompletionUseCase';
export declare class ReviewProjectCompletionUseCase implements IReviewProjectCompletionUseCase {
    private readonly approveUseCase;
    private readonly rejectUseCase;
    constructor(approveUseCase: IApproveProjectCompletionUseCase, rejectUseCase: IRejectProjectCompletionUseCase);
    execute(projectId: string, clientId: string, decision: 'approve' | 'reject'): Promise<void>;
}
//# sourceMappingURL=ReviewProjectCompletionUseCase.d.ts.map