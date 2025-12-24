import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { CreateSubscriptionPlanDTO } from '../../dto/subscription/CreateSubscriptionPlanDTO';
import { ICreateSubscriptionPlanUseCase } from './interfaces/ICreateSubscriptionPlanUseCase';
import { SubscriptionPlanDTO } from '../../dto/subscription/SubscriptionPlanDTO';
import { ISubscriptionPlanMapper } from '../../mappers/interfaces/ISubscriptionPlanMapper';
export declare class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    private featureRepository;
    private subscriptionPlanMapper;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository, featureRepository: IFeatureRepository, subscriptionPlanMapper: ISubscriptionPlanMapper);
    execute(adminUserId: string, dto: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO>;
}
//# sourceMappingURL=CreateSubscriptionPlanUseCase.d.ts.map