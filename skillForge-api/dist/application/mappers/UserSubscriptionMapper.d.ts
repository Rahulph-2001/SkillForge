import { UserSubscriptionResponseDTO } from '../dto/subscription/UserSubscriptionResponseDTO';
import { UserSubscription } from '../../domain/entities/UserSubscription';
import { IUserSubscriptionMapper } from './interfaces/IUserSubscriptionMapper';
export declare class UserSubscriptionMapper implements IUserSubscriptionMapper {
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    toDTO(subscription: UserSubscription, planName?: string): UserSubscriptionResponseDTO;
    /**
     * Map array of UserSubscription entities to DTOs
     */
    toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[];
}
//# sourceMappingURL=UserSubscriptionMapper.d.ts.map