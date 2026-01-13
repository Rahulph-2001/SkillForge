import { SubscriptionStats } from '../../../../domain/repositories/ISubscriptionPlanRepository';
export interface IGetSubscriptionStatsUseCase {
    execute(adminUserId: string): Promise<SubscriptionStats>;
}
export type { SubscriptionStats };
//# sourceMappingURL=IGetSubscriptionStatsUseCase.d.ts.map