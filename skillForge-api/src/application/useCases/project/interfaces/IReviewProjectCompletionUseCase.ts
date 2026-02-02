export type ProjectCompletionDecision = 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';

export interface IReviewProjectCompletionUseCase {
    execute(projectId: string, clientId: string, decision: ProjectCompletionDecision, reason?: string): Promise<void>;
}
