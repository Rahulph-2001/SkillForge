import { ISubscriptionPlanRepository, SubscriptionStats } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class GetSubscriptionStatsUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository);
    execute(adminUserId: string): Promise<SubscriptionStats>;
}
//# sourceMappingURL=GetSubscriptionStatsUseCase.d.ts.map