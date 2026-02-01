import { ICheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/interfaces/ICheckSubscriptionExpiryUseCase';
export declare class CronScheduler {
    private checkSubscriptionExpiryUseCase;
    constructor(checkSubscriptionExpiryUseCase: ICheckSubscriptionExpiryUseCase);
    start(): void;
}
//# sourceMappingURL=CronScheduler.d.ts.map