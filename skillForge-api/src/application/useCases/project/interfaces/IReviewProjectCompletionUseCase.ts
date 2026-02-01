export type ProjectCompletionDecision = 'APPROVE' | 'REJECT';

export interface IReviewProjectCompletionUseCase {
    execute(projectId: string, clientId: string, decision: ProjectCompletionDecision): Promise<void>;
}
