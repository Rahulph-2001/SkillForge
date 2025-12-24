"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageRecordResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Usage Record Response DTO
 */
exports.UsageRecordResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid usage record ID'),
    subscriptionId: zod_1.z.string().uuid('Invalid subscription ID'),
    featureKey: zod_1.z.string().min(1, 'Feature key is required'),
    usageCount: zod_1.z.number().int().min(0, 'Usage count must be non-negative'),
    limitValue: zod_1.z.number().int().min(0).optional(),
    remainingUsage: zod_1.z.number().int().nullable(),
    usagePercentage: zod_1.z.number().min(0).max(100).nullable(),
    hasReachedLimit: zod_1.z.boolean(),
    periodStart: zod_1.z.coerce.date(),
    periodEnd: zod_1.z.coerce.date(),
    isPeriodActive: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=UsageRecordResponseDTO.js.map