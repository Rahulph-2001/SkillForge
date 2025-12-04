import { CreateSubscriptionPlanDTO } from '../../../dto/subscription/CreateSubscriptionPlanDTO';
import { SubscriptionPlanDTO } from '../../../dto/subscription/SubscriptionPlanDTO';

export interface ICreateSubscriptionPlanUseCase {
  execute(adminUserId: string, dto: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO>;
}
