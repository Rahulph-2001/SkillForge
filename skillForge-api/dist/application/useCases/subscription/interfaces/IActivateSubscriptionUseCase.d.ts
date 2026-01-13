import { ActivateSubscriptionRequestDTO } from '../../../dto/subscription/ActivateSubscriptionDTO';
import { SubscriptionActivationResponseDTO } from '../../../dto/subscription/SubscriptionActivationResponseDTO';
export interface IActivateSubscriptionUseCase {
    execute(dto: ActivateSubscriptionRequestDTO): Promise<SubscriptionActivationResponseDTO>;
}
//# sourceMappingURL=IActivateSubscriptionUseCase.d.ts.map