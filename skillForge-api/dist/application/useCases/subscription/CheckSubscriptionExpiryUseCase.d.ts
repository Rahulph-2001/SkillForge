import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
export interface ICheckSubscriptionExpiryUseCase {
    execute(): Promise<void>;
}
export declare class CheckSubscriptionExpiryUseCase implements ICheckSubscriptionExpiryUseCase {
    private subscriptionRepository;
    constructor(subscriptionRepository: IUserSubscriptionRepository);
    execute(): Promise<void>;
}
//# sourceMappingURL=CheckSubscriptionExpiryUseCase.d.ts.map