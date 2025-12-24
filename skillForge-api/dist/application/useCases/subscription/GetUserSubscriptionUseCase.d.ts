import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
export interface IGetUserSubscriptionUseCase {
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}
export declare class GetUserSubscriptionUseCase implements IGetUserSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository);
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=GetUserSubscriptionUseCase.d.ts.map