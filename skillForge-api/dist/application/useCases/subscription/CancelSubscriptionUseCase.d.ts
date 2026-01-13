import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICancelSubscriptionUseCase } from './interfaces/ICancelSubscriptionUseCase';
export declare class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
    private subscriptionRepository;
    private planRepository;
    private userRepository;
    private userSubscriptionMapper;
    constructor(subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, userRepository: IUserRepository, userSubscriptionMapper: IUserSubscriptionMapper);
    execute(userId: string, immediate?: boolean): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=CancelSubscriptionUseCase.d.ts.map