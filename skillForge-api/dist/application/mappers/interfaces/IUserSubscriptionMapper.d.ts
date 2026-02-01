import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
export interface IUserSubscriptionMapper {
    toDTO(subscription: UserSubscription, planName?: string, usageRecords?: any[], planLimits?: any): UserSubscriptionResponseDTO;
    toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[];
}
//# sourceMappingURL=IUserSubscriptionMapper.d.ts.map