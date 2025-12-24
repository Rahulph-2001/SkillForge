import { UsageRecord } from '../entities/UsageRecord';

export interface IUsageRecordRepository {
    /**
     * Create a new usage record
     */
    create(usageRecord: UsageRecord): Promise<UsageRecord>;

    /**
     * Find usage record by ID
     */
    findById(id: string): Promise<UsageRecord | null>;

    /**
     * Find usage record by subscription and feature for current period
     */
    findBySubscriptionAndFeature(
        subscriptionId: string,
        featureKey: string,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord | null>;

    /**
     * Find all usage records for a subscription
     */
    findBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;

    /**
     * Find current period usage records for a subscription
     */
    findCurrentPeriodBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;

    /**
     * Update usage record
     */
    update(usageRecord: UsageRecord): Promise<UsageRecord>;

    /**
     * Delete usage record
     */
    delete(id: string): Promise<void>;

    /**
     * Reset usage for a subscription (new billing period)
     */
    resetUsageForSubscription(subscriptionId: string, newPeriodStart: Date, newPeriodEnd: Date): Promise<void>;

    /**
     * Get or create usage record for tracking
     */
    getOrCreate(
        subscriptionId: string,
        featureKey: string,
        limitValue: number | undefined,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord>;
}
