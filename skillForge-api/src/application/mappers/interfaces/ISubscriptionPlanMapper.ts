import { type SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { type SubscriptionPlanDTO } from '../../dto/subscription/SubscriptionPlanDTO';

export interface ISubscriptionPlanMapper {
  toDTO(plan: SubscriptionPlan): SubscriptionPlanDTO;
}
