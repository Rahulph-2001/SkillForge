import { type ActivateSubscriptionRequestDTO } from '../../../dto/subscription/ActivateSubscriptionDTO';
import { type SubscriptionActivationResponseDTO } from '../../../dto/subscription/SubscriptionActivationResponseDTO';

export interface IActivateSubscriptionUseCase {
    execute(dto: ActivateSubscriptionRequestDTO): Promise<SubscriptionActivationResponseDTO>;
}

