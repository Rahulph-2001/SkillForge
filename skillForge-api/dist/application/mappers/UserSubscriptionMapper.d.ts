import { UserSubscriptionResponseDTO } from '../dto/subscription/UserSubscriptionResponseDTO';
import { UserSubscription } from '../../domain/entities/UserSubscription';
export declare class UserSubscriptionMapper {
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    static toDTO(subscription: UserSubscription, planName?: string): UserSubscriptionResponseDTO;
    /**
     * Map array of UserSubscription entities to DTOs
     */
    static toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[];
}
//# sourceMappingURL=UserSubscriptionMapper.d.ts.map