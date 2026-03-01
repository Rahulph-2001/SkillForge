import { type UserSubscription } from '../../../domain/entities/UserSubscription';
import { type UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';

export interface IUserSubscriptionMapper {
  toDTO(subscription: UserSubscription, planName?: string, usageRecords?: Record<string, unknown>[], planLimits?: Record<string, number>): UserSubscriptionResponseDTO;
  toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[];
}

