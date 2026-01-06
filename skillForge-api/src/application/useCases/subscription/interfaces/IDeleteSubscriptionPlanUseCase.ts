export interface IDeleteSubscriptionPlanUseCase {
  execute(adminUserId: string, planId: string): Promise<void>;
}

