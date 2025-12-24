import { Database } from '../Database';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { UsageRecord } from '../../../domain/entities/UsageRecord';
export declare class PrismaUsageRecordRepository implements IUsageRecordRepository {
    private readonly prisma;
    constructor(db: Database);
    create(usageRecord: UsageRecord): Promise<UsageRecord>;
    findById(id: string): Promise<UsageRecord | null>;
    findBySubscriptionAndFeature(subscriptionId: string, featureKey: string, periodStart: Date, periodEnd: Date): Promise<UsageRecord | null>;
    findBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;
    findCurrentPeriodBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]>;
    update(usageRecord: UsageRecord): Promise<UsageRecord>;
    delete(id: string): Promise<void>;
    resetUsageForSubscription(subscriptionId: string, newPeriodStart: Date, newPeriodEnd: Date): Promise<void>;
    getOrCreate(subscriptionId: string, featureKey: string, limitValue: number | undefined, periodStart: Date, periodEnd: Date): Promise<UsageRecord>;
}
//# sourceMappingURL=UsageRecordRepository.d.ts.map