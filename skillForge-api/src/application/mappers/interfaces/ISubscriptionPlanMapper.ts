import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '../../dto/subscription/SubscriptionPlanDTO';

export interface ISubscriptionPlanMapper {
  toDTO(plan: SubscriptionPlan): SubscriptionPlanDTO;
}
