import { injectable } from 'inversify';
import { UserSubscriptionResponseDTO } from '../dto/subscription/UserSubscriptionResponseDTO';
import { UserSubscription } from '../../domain/entities/UserSubscription';
import { IUserSubscriptionMapper } from './interfaces/IUserSubscriptionMapper';

@injectable()
export class UserSubscriptionMapper implements IUserSubscriptionMapper {
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    toDTO(
        subscription: UserSubscription,
        planName?: string,
        usageRecords: any[] = [],
        planLimits: any = {}
    ): UserSubscriptionResponseDTO {
        const now = new Date();
        const daysUntilRenewal = Math.ceil(
            (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Map usage
        const usageStats = Object.keys(planLimits).map(featureKey => {
            const record = usageRecords.find(r => r.featureKey === featureKey);
            return {
                feature: featureKey,
                used: record ? record.usageCount : 0,
                limit: planLimits[featureKey]
            };
        });

        // Also add records that might not be in plan limits (custom features)
        usageRecords.forEach(record => {
            if (!usageStats.find(s => s.feature === record.featureKey)) {
                usageStats.push({
                    feature: record.featureKey,
                    used: record.usageCount,
                    limit: record.limitValue
                });
            }
        });

        return {
            id: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAt: subscription.cancelAt,
            canceledAt: subscription.canceledAt,
            trialStart: subscription.trialStart,
            trialEnd: subscription.trialEnd,
            isInTrial: subscription.isInTrial(),
            hasExpired: subscription.hasExpired(),
            willCancelAtPeriodEnd: subscription.willCancelAtPeriodEnd(),
            daysUntilRenewal: daysUntilRenewal > 0 ? daysUntilRenewal : undefined,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripeCustomerId: subscription.stripeCustomerId,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            usage: usageStats
        };
    }

    /**
     * Map array of UserSubscription entities to DTOs
     */
    toDTOArray(subscriptions: UserSubscription[]): UserSubscriptionResponseDTO[] {
        return subscriptions.map((subscription) => this.toDTO(subscription));
    }
}
