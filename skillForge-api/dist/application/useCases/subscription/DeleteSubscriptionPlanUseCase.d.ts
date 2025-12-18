import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DeleteSubscriptionPlanUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository);
    execute(adminUserId: string, planId: string): Promise<void>;
}
//# sourceMappingURL=DeleteSubscriptionPlanUseCase.d.ts.map