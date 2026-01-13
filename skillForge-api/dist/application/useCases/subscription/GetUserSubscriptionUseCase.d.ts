import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IGetUserSubscriptionUseCase } from './interfaces/IGetUserSubscriptionUseCase';
export declare class GetUserSubscriptionUseCase implements IGetUserSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private userSubscriptionMapper;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, userSubscriptionMapper: IUserSubscriptionMapper);
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=GetUserSubscriptionUseCase.d.ts.map