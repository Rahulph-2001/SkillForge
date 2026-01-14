export interface IValidateProjectPostLimitUseCase {
  execute(userId: string): Promise<void>;
}