import { injectable, inject } from 'inversify';
import { Database } from '../Database';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { UsageRecord } from '../../../domain/entities/UsageRecord';
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from '../../di/types';
import { BaseRepository } from '../BaseRepository';
import { PrismaClient } from '@prisma/client';

@injectable()
export class UsageRecordRepository extends BaseRepository<UsageRecord> implements IUsageRecordRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'usageRecord');
    }

    async create(usageRecord: UsageRecord): Promise<UsageRecord> {
        const data = await this.prisma.usageRecord.create({
            data: {
                subscriptionId: usageRecord.subscriptionId,
                featureKey: usageRecord.featureKey,
                usageCount: usageRecord.usageCount,
                limitValue: usageRecord.limitValue,
                periodStart: usageRecord.periodStart,
                periodEnd: usageRecord.periodEnd,
            },
        });

        return UsageRecord.fromJSON(data);
    }

    async findById(id: string): Promise<UsageRecord | null> {
        const data = await this.prisma.usageRecord.findUnique({
            where: { id },
        });

        return data ? UsageRecord.fromJSON(data) : null;
    }

    async findBySubscriptionAndFeature(
        subscriptionId: string,
        featureKey: string,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord | null> {
        const data = await this.prisma.usageRecord.findFirst({
            where: {
                subscriptionId,
                featureKey,
                periodStart: {
                    lte: periodStart,
                },
                periodEnd: {
                    gte: periodEnd,
                },
            },
        });

        return data ? UsageRecord.fromJSON(data) : null;
    }

    async findBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]> {
        const data = await this.prisma.usageRecord.findMany({
            where: { subscriptionId },
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item: any) => UsageRecord.fromJSON(item));
    }

    async findCurrentPeriodBySubscriptionId(subscriptionId: string): Promise<UsageRecord[]> {
        const now = new Date();
        const data = await this.prisma.usageRecord.findMany({
            where: {
                subscriptionId,
                periodStart: { lte: now },
                periodEnd: { gte: now },
            },
        });

        return data.map((item: any) => UsageRecord.fromJSON(item));
    }

    async update(usageRecord: UsageRecord): Promise<UsageRecord> {
        const data = await this.prisma.usageRecord.update({
            where: { id: usageRecord.id },
            data: {
                usageCount: usageRecord.usageCount,
                limitValue: usageRecord.limitValue,
                updatedAt: usageRecord.updatedAt,
            },
        });

        return UsageRecord.fromJSON(data);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.usageRecord.delete({
            where: { id },
        });
    }

    async resetUsageForSubscription(
        subscriptionId: string,
        newPeriodStart: Date,
        newPeriodEnd: Date
    ): Promise<void> {
        // Get all current usage records
        const currentRecords = await this.findCurrentPeriodBySubscriptionId(subscriptionId);

        // Create new records for the new period with reset counts
        const newRecords = currentRecords.map((record) => ({
            subscriptionId,
            featureKey: record.featureKey,
            usageCount: 0,
            limitValue: record.limitValue,
            periodStart: newPeriodStart,
            periodEnd: newPeriodEnd,
        }));

        // Create all new records in a transaction
        await (this.prisma as PrismaClient).$transaction(
            newRecords.map((record) =>
                this.prisma.usageRecord.create({
                    data: record,
                })
            )
        );
    }

    async getOrCreate(
        subscriptionId: string,
        featureKey: string,
        limitValue: number | undefined,
        periodStart: Date,
        periodEnd: Date
    ): Promise<UsageRecord> {
        // Try to find existing record
        const existing = await this.findBySubscriptionAndFeature(
            subscriptionId,
            featureKey,
            periodStart,
            periodEnd
        );

        if (existing) {
            return existing;
        }

        // Create new record
        const newRecord = new UsageRecord({
            id: uuidv4(),
            subscriptionId,
            featureKey,
            usageCount: 0,
            limitValue,
            periodStart,
            periodEnd,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return await this.create(newRecord);
    }

    async upsert(record: UsageRecord): Promise<UsageRecord> {
        const data = record.toJSON();

        const upserted = await this.prisma.usageRecord.upsert({
            where: {
                subscriptionId_featureKey_periodStart: {
                    subscriptionId: data.subscriptionId as string,
                    featureKey: data.featureKey as string,
                    periodStart: data.periodStart as Date,
                },
            },
            create: {
                id: data.id as string,
                subscriptionId: data.subscriptionId as string,
                featureKey: data.featureKey as string,
                usageCount: data.usageCount as number,
                limitValue: data.limitValue as number | null,
                periodStart: data.periodStart as Date,
                periodEnd: data.periodEnd as Date,
                createdAt: data.createdAt as Date,
                updatedAt: data.updatedAt as Date,
            },
            update: {
                usageCount: data.usageCount as number,
                limitValue: data.limitValue as number | null,
                updatedAt: new Date(),
            },
        });

        return UsageRecord.fromJSON(upserted);
    }
}