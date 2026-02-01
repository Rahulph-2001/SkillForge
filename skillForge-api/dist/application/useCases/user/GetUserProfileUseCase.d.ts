import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IGetUserProfileUseCase, UserProfileDTO } from './interfaces/IGetUserProfileUseCase';
export declare class GetUserProfileUseCase implements IGetUserProfileUseCase {
    private readonly userRepository;
    private readonly skillRepository;
    private readonly subscriptionRepository;
    private readonly planRepository;
    private readonly usageRecordRepository;
    constructor(userRepository: IUserRepository, skillRepository: ISkillRepository, subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, usageRecordRepository: IUsageRecordRepository);
    execute(userId: string): Promise<UserProfileDTO>;
}
//# sourceMappingURL=GetUserProfileUseCase.d.ts.map