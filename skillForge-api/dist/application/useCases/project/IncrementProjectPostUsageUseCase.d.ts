import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IIncrementProjectPostUsageUseCase } from './interfaces/IIncrementProjectPostUsageUseCase';
export declare class IncrementProjectPostUsageUseCase implements IIncrementProjectPostUsageUseCase {
    private readonly subscriptionRepository;
    private readonly planRepository;
    private readonly usageRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, usageRepository: IUsageRecordRepository);
    execute(userId: string): Promise<void>;
}
//# sourceMappingURL=IncrementProjectPostUsageUseCase.d.ts.map