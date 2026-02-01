export interface IRequestProjectCompletionUseCase {
    execute(projectId: string, contributorId: string): Promise<void>;
}
