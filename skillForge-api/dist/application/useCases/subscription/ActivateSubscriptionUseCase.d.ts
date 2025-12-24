import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { ActivateSubscriptionRequestDTO } from '../../dto/subscription/ActivateSubscriptionDTO';
import { SubscriptionActivationResponseDTO } from '../../dto/subscription/SubscriptionActivationResponseDTO';
export interface IActivateSubscriptionUseCase {
    execute(dto: ActivateSubscriptionRequestDTO): Promise<SubscriptionActivationResponseDTO>;
}
export declare class ActivateSubscriptionUseCase implements IActivateSubscriptionUseCase {
    private userRepository;
    private subscriptionRepository;
    private planRepository;
    constructor(userRepository: IUserRepository, subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository);
    execute(dto: ActivateSubscriptionRequestDTO): Promise<SubscriptionActivationResponseDTO>;
    private mapBadgeToSubscriptionPlan;
}
//# sourceMappingURL=ActivateSubscriptionUseCase.d.ts.map