import { UserSubscriptionResponseDTO } from '../../../dto/subscription/UserSubscriptionResponseDTO';

export interface ICancelSubscriptionUseCase {
    execute(userId: string, immediate?: boolean): Promise<UserSubscriptionResponseDTO>;
}

