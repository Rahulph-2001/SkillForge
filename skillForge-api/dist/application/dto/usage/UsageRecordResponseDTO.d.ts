import { z } from 'zod';
/**
 * Zod schema for Usage Record Response DTO
 */
export declare const UsageRecordResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    subscriptionId: z.ZodString;
    featureKey: z.ZodString;
    usageCount: z.ZodNumber;
    limitValue: z.ZodOptional<z.ZodNumber>;
    remainingUsage: z.ZodNullable<z.ZodNumber>;
    usagePercentage: z.ZodNullable<z.ZodNumber>;
    hasReachedLimit: z.ZodBoolean;
    periodStart: z.ZodCoercedDate<unknown>;
    periodEnd: z.ZodCoercedDate<unknown>;
    isPeriodActive: z.ZodBoolean;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type UsageRecordResponseDTO = z.infer<typeof UsageRecordResponseDTOSchema>;
//# sourceMappingURL=UsageRecordResponseDTO.d.ts.map