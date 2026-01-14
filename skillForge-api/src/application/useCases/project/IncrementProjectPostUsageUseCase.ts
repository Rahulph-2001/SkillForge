import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IIncrementProjectPostUsageUseCase } from './interfaces/IIncrementProjectPostUsageUseCase';

@injectable()
export class IncrementProjectPostUsageUseCase implements IIncrementProjectPostUsageUseCase {
  constructor(
    @inject(TYPES.IUserSubscriptionRepository) private readonly subscriptionRepository: IUserSubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository) private readonly planRepository: ISubscriptionPlanRepository,
    @inject(TYPES.IUsageRecordRepository) private readonly usageRepository: IUsageRecordRepository
  ) {}

  public async execute(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    
    if (!subscription) {
      return;
    }

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      return;
    }

    const limitValue = plan.projectPosts;

    const usageRecord = await this.usageRepository.getOrCreate(
      subscription.id,
      'project_posts',
      limitValue !== null && limitValue !== -1 ? limitValue : undefined,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    usageRecord.incrementUsage();
    await this.usageRepository.update(usageRecord);

    console.log(`[IncrementProjectPostUsage] User ${userId}: ${usageRecord.usageCount}/${limitValue || 'unlimited'} project posts used`);
  }
}