import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IGetUserSubscriptionUseCase } from './interfaces/IGetUserSubscriptionUseCase';
export declare class GetUserSubscriptionUseCase implements IGetUserSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private usageRecordRepository;
    private featureRepository;
    private userSubscriptionMapper;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, usageRecordRepository: IUsageRecordRepository, featureRepository: IFeatureRepository, userSubscriptionMapper: IUserSubscriptionMapper);
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=GetUserSubscriptionUseCase.d.ts.map