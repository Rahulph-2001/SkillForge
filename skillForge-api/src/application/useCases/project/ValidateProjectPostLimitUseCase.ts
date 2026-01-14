import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IValidateProjectPostLimitUseCase } from './interfaces/IValidateProjectPostLimitUseCase';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class ValidateProjectPostLimitUseCase implements IValidateProjectPostLimitUseCase {
  constructor(
    @inject(TYPES.IUserSubscriptionRepository) private readonly subscriptionRepository: IUserSubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private readonly planRepository: ISubscriptionPlanRepository,
    @inject(TYPES.IUsageRecordRepository) private readonly usageRepository: IUsageRecordRepository
  ) {}

  public async execute(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    
    if (!subscription) {
      throw new ForbiddenError('You must have an active subscription to post projects');
    }

    if (!subscription.isActive()) {
      throw new ForbiddenError('Your subscription is not active. Please activate or renew your subscription to post projects');
    }

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (plan.hasUnlimitedProjectPosts()) {
      return;
    }

    const projectPostsLimit = plan.projectPosts;
    if (projectPostsLimit === null || projectPostsLimit === -1) {
      return;
    }

    const usageRecord = await this.usageRepository.findBySubscriptionAndFeature(
      subscription.id,
      'project_posts',
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    const currentUsage = usageRecord?.usageCount || 0;

    if (currentUsage >= projectPostsLimit) {
      throw new ForbiddenError(
        `You have reached your project post limit (${projectPostsLimit} posts per ${this.getBillingPeriodText(subscription)}). Please upgrade your plan to post more projects.`
      );
    }
  }

  private getBillingPeriodText(subscription: any): string {
    const days = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days <= 31) return 'month';
    if (days <= 93) return 'quarter';
    if (days <= 366) return 'year';
    return 'billing period';
  }
}