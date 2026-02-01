import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { IUserSubscriptionMapper } from '../../mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionResponseDTO } from '../../dto/subscription/UserSubscriptionResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IGetUserSubscriptionUseCase } from './interfaces/IGetUserSubscriptionUseCase';

@injectable()
export class GetUserSubscriptionUseCase implements IGetUserSubscriptionUseCase {
    constructor(
        @inject(TYPES.IUserSubscriptionRepository) private subscriptionRepository: IUserSubscriptionRepository,
        @inject(TYPES.ISubscriptionPlanRepository) private planRepository: ISubscriptionPlanRepository,
        @inject(TYPES.IUsageRecordRepository) private usageRecordRepository: IUsageRecordRepository,
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
        @inject(TYPES.IUserSubscriptionMapper) private userSubscriptionMapper: IUserSubscriptionMapper
    ) { }

    async execute(userId: string): Promise<UserSubscriptionResponseDTO> {
        // Find user's subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);

        if (!subscription) {
            throw new NotFoundError('User does not have an active subscription');
        }

        // Get plan details
        const plan = await this.planRepository.findById(subscription.planId);

        if (!plan) {
            throw new NotFoundError('Subscription plan not found');
        }

        // Fetch usage records for the current period
        const usageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);
        const currentUsageRecords = usageRecords.filter(r =>
            r.periodStart.getTime() === subscription.currentPeriodStart.getTime()
        );

        // Fetch features to build limits object
        const features = await this.featureRepository.findByPlanId(plan.id);
        const planLimits: any = {};

        // 1. Map Legacy Limits
        if (plan.projectPosts !== null) planLimits['project_posts'] = plan.projectPosts;
        if (plan.createCommunity !== null) planLimits['create_community'] = plan.createCommunity;

        // 2. Map Feature Limits (Override legacy if present)
        features.forEach(f => {
            if (f.limitValue !== null) {
                // Determine key (snake_case conversion if needed, but usually exact match expected by frontend)
                // We'll trust the feature name is the key or map common ones
                const key = f.name.toLowerCase().replace(/ /g, '_');
                planLimits[key] = f.limitValue;
            } else if (f.featureType === 'BOOLEAN' && f.isEnabled) {
                // Boolean features are usually "Unlimited" (-1) if just presence checked
                const key = f.name.toLowerCase().replace(/ /g, '_');
                // Only add if not already present or if we want to show boolean features as usage
                // Usually usage only makes sense for limits. 
                // We can skip boolean features for usage tracking unless we want to show "Active"
            }
        });

        // Map to DTO with plan name and usage stats
        return this.userSubscriptionMapper.toDTO(
            subscription,
            plan.name,
            currentUsageRecords,
            planLimits
        );
    }
}
