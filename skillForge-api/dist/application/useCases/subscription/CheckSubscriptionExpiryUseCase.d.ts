import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICheckSubscriptionExpiryUseCase } from './interfaces/ICheckSubscriptionExpiryUseCase';
export declare class CheckSubscriptionExpiryUseCase implements ICheckSubscriptionExpiryUseCase {
    private subscriptionRepository;
    private userRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository, userRepository: IUserRepository);
    execute(): Promise<void>;
}
//# sourceMappingURL=CheckSubscriptionExpiryUseCase.d.ts.map