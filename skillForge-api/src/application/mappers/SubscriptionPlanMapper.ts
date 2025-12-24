import { injectable } from 'inversify';
import { SubscriptionPlan } from '../../domain/entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '../dto/subscription/SubscriptionPlanDTO';
import { ISubscriptionPlanMapper } from './interfaces/ISubscriptionPlanMapper';

@injectable()
export class SubscriptionPlanMapper implements ISubscriptionPlanMapper {
  public toDTO(plan: SubscriptionPlan): SubscriptionPlanDTO {
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      projectPosts: plan.projectPosts,
      createCommunity: plan.createCommunity,
      features: plan.features,
      badge: plan.badge,
      color: plan.color,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
