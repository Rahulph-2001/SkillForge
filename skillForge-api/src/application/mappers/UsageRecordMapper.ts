import { injectable } from 'inversify';
import { UsageRecordResponseDTO } from '../dto/usage/UsageRecordResponseDTO';
import { UsageRecord } from '../../domain/entities/UsageRecord';
import { IUsageRecordMapper } from './interfaces/IUsageRecordMapper';

@injectable()
export class UsageRecordMapper implements IUsageRecordMapper {
    /**
     * Map UsageRecord entity to UsageRecordResponseDTO with computed fields
     */
    toDTO(usageRecord: UsageRecord): UsageRecordResponseDTO {
        return {
            id: usageRecord.id,
            subscriptionId: usageRecord.subscriptionId,
            featureKey: usageRecord.featureKey,
            usageCount: usageRecord.usageCount,
            limitValue: usageRecord.limitValue,
            remainingUsage: usageRecord.getRemainingUsage(),
            usagePercentage: usageRecord.getUsagePercentage(),
            hasReachedLimit: usageRecord.hasReachedLimit(),
            periodStart: usageRecord.periodStart,
            periodEnd: usageRecord.periodEnd,
            isPeriodActive: usageRecord.isPeriodActive(),
            createdAt: usageRecord.createdAt,
            updatedAt: usageRecord.updatedAt,
        };
    }

    /**
     * Map array of UsageRecord entities to DTOs
     */
    toDTOArray(usageRecords: UsageRecord[]): UsageRecordResponseDTO[] {
        return usageRecords.map((record) => this.toDTO(record));
    }
}
