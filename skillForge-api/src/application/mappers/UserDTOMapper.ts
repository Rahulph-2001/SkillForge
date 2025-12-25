import { injectable, inject } from 'inversify';
import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/auth/UserResponseDTO';
import { IUserDTOMapper } from './interfaces/IUserDTOMapper';
import { IUserSubscriptionRepository } from '../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../domain/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../infrastructure/di/types';

@injectable()
export class UserDTOMapper implements IUserDTOMapper {
  constructor(
    @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private planRepository: ISubscriptionPlanRepository
  ) { }

  public async toUserResponseDTO(user: User): Promise<UserResponseDTO> {
    // Fetch active subscription to get real plan name
    let subscriptionPlan = user.subscriptionPlan; // Default to user's stored plan

    try {
      const subscription = await this.subscriptionRepository.findByUserId(user.id);
      if (subscription && subscription.status === 'ACTIVE') {
        const plan = await this.planRepository.findById(subscription.planId);
        if (plan) {
          // Map plan badge to subscription plan type (badge is the tier: Free, Starter, Professional, Enterprise)
          subscriptionPlan = plan.badge.toLowerCase() as any;
        }
      }
    } catch (error) {
      // If subscription fetch fails, fall back to user's stored plan
      console.warn(`Failed to fetch subscription for user ${user.id}:`, error);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
      credits: user.credits,
      subscriptionPlan,
      avatarUrl: user.avatarUrl,
      verification: {
        email_verified: user.verification.email_verified
      }
    };
  }
}