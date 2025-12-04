import { SubscriptionPlanDTO } from './SubscriptionPlanDTO';

export interface ListSubscriptionPlansResponseDTO {
  plans: SubscriptionPlanDTO[];
  total: number;
}
