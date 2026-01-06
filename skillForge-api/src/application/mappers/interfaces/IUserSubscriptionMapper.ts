import { UserSubscription } from '../../../domain/entities/UserSubscription';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';

export interface IUserSubscriptionMapper {
  toDTO(subscription: UserSubscription, planName?: string): UserSubscriptionResponseDTO;
  toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[];
}

