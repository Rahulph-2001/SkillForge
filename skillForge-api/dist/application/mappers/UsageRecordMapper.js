"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageRecordMapper = void 0;
class UsageRecordMapper {
    /**
     * Map UsageRecord entity to UsageRecordResponseDTO with computed fields
     */
    static toDTO(usageRecord) {
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
    static toDTOArray(usageRecords) {
        return usageRecords.map((record) => this.toDTO(record));
    }
}
exports.UsageRecordMapper = UsageRecordMapper;
//# sourceMappingURL=UsageRecordMapper.js.map