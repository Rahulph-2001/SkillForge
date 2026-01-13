import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDeleteSubscriptionPlanUseCase } from './interfaces/IDeleteSubscriptionPlanUseCase';
export declare class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
    private userRepository;
    private subscriptionPlanRepository;
    constructor(userRepository: IUserRepository, subscriptionPlanRepository: ISubscriptionPlanRepository);
    execute(adminUserId: string, planId: string): Promise<void>;
}
//# sourceMappingURL=DeleteSubscriptionPlanUseCase.d.ts.map