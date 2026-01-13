
import { UsageRecord } from '../entities/UsageRecord';

export interface IUsageRecordRepository {
    create(record: UsageRecord): Promise<UsageRecord>;
    findById(id: string): Promise<UsageRecord | null>;
    findBySubscriptionAndFeature(
        subscriptionId: string,
        featureKey: string,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord | null>;
    findBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;
    findCurrentPeriodBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;
    update(record: UsageRecord): Promise<UsageRecord>;
    delete(id: string): Promise<void>;
    getOrCreate(
        subscriptionId: string,
        featureKey: string,
        limitValue: number | undefined,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord>;
    upsert(record: UsageRecord): Promise<UsageRecord>;
}