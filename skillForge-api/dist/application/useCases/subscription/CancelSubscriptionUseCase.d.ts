import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export interface ICancelSubscriptionUseCase {
    execute(userId: string, immediate?: boolean): Promise<UserSubscriptionResponseDTO>;
}
export declare class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private userRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, userRepository: IUserRepository);
    execute(userId: string, immediate?: boolean): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=CancelSubscriptionUseCase.d.ts.map