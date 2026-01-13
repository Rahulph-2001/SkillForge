import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetSubscriptionStatsUseCase, SubscriptionStats } from './interfaces/IGetSubscriptionStatsUseCase';
export declare class GetSubscriptionStatsUseCase implements IGetSubscriptionStatsUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository);
    execute(adminUserId: string): Promise<SubscriptionStats>;
}
//# sourceMappingURL=GetSubscriptionStatsUseCase.d.ts.map