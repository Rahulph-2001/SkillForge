export interface IReactivateSubscriptionUseCase {
    execute(userId: string): Promise<void>;
}

