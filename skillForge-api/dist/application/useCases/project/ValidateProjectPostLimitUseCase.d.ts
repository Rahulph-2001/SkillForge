import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IValidateProjectPostLimitUseCase } from './interfaces/IValidateProjectPostLimitUseCase';
export declare class ValidateProjectPostLimitUseCase implements IValidateProjectPostLimitUseCase {
    private readonly subscriptionRepository;
    private readonly planRepository;
    private readonly usageRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, usageRepository: IUsageRecordRepository);
    execute(userId: string): Promise<void>;
    private getBillingPeriodText;
}
//# sourceMappingURL=ValidateProjectPostLimitUseCase.d.ts.map