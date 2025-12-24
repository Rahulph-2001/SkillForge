import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { UpdateSubscriptionPlanDTO } from '../../dto/subscription/UpdateSubscriptionPlanDTO';
import { IUpdateSubscriptionPlanUseCase } from './interfaces/IUpdateSubscriptionPlanUseCase';
import { SubscriptionPlanDTO } from '../../dto/subscription/SubscriptionPlanDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';
export declare class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    private featureRepository;
    private subscriptionPlanMapper;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository, featureRepository: IFeatureRepository, subscriptionPlanMapper: ISubscriptionPlanMapper);
    execute(adminUserId: string, planId: string, dto: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO>;
}
//# sourceMappingURL=UpdateSubscriptionPlanUseCase.d.ts.map