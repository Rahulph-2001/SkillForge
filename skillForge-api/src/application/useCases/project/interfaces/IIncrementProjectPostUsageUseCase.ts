export interface IIncrementProjectPostUsageUseCase {
  execute(userId: string): Promise<void>;
}