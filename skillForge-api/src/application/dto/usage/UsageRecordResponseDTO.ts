import { z } from 'zod';

/**
 * Zod schema for Usage Record Response DTO
 */
export const UsageRecordResponseDTOSchema = z.object({
    id: z.string().uuid('Invalid usage record ID'),
    subscriptionId: z.string().uuid('Invalid subscription ID'),
    featureKey: z.string().min(1, 'Feature key is required'),
    usageCount: z.number().int().min(0, 'Usage count must be non-negative'),
    limitValue: z.number().int().min(0).optional(),
    remainingUsage: z.number().int().nullable(),
    usagePercentage: z.number().min(0).max(100).nullable(),
    hasReachedLimit: z.boolean(),
    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),
    isPeriodActive: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type UsageRecordResponseDTO = z.infer<typeof UsageRecordResponseDTOSchema>;
