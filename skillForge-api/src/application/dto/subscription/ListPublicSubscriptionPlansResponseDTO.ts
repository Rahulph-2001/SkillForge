import { SubscriptionPlanDTO } from './SubscriptionPlanDTO';

export interface ListPublicSubscriptionPlansResponseDTO {
  plans: SubscriptionPlanDTO[];
  total: number;
}
