export interface IReviewProjectCompletionUseCase {
    execute(projectId: string, clientId: string, decision: 'approve' | 'reject'): Promise<void>;
}
//# sourceMappingURL=IReviewProjectCompletionUseCase.d.ts.map