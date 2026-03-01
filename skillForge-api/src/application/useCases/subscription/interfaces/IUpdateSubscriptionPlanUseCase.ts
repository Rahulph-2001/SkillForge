import { type UpdateSubscriptionPlanDTO } from '../../../dto/subscription/UpdateSubscriptionPlanDTO';
import { type SubscriptionPlanDTO } from '../../../dto/subscription/SubscriptionPlanDTO';

export interface IUpdateSubscriptionPlanUseCase {
  execute(adminUserId: string, planId: string, dto: UpdateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO>;
}
