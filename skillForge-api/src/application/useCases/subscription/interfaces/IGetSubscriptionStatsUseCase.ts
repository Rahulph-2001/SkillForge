import { SubscriptionStats } from '../../../../domain/repositories/ISubscriptionPlanRepository';

export interface IGetSubscriptionStatsUseCase {
  execute(adminUserId: string): Promise<SubscriptionStats>;
}

