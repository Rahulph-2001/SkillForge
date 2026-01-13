"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageRecordMapper = void 0;
const inversify_1 = require("inversify");
let UsageRecordMapper = class UsageRecordMapper {
    /**
     * Map UsageRecord entity to UsageRecordResponseDTO with computed fields
     */
    toDTO(usageRecord) {
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
    toDTOArray(usageRecords) {
        return usageRecords.map((record) => this.toDTO(record));
    }
};
exports.UsageRecordMapper = UsageRecordMapper;
exports.UsageRecordMapper = UsageRecordMapper = __decorate([
    (0, inversify_1.injectable)()
], UsageRecordMapper);
//# sourceMappingURL=UsageRecordMapper.js.map