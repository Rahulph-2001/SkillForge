import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IReactivateSubscriptionUseCase } from './interfaces/IReactivateSubscriptionUseCase';
export declare class ReactivateSubscriptionUseCase implements IReactivateSubscriptionUseCase {
    private subscriptionRepository;
    private userRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, userRepository: IUserRepository);
    execute(userId: string): Promise<void>;
}
//# sourceMappingURL=ReactivateSubscriptionUseCase.d.ts.map