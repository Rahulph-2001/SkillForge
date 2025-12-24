import { z } from 'zod';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';
/**
 * Zod schema for User Subscription Response DTO
 */
export declare const UserSubscriptionResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    planId: z.ZodString;
    planName: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<typeof SubscriptionStatus>;
    currentPeriodStart: z.ZodCoercedDate<unknown>;
    currentPeriodEnd: z.ZodCoercedDate<unknown>;
    cancelAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    canceledAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    trialStart: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    trialEnd: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    isInTrial: z.ZodBoolean;
    hasExpired: z.ZodBoolean;
    willCancelAtPeriodEnd: z.ZodBoolean;
    daysUntilRenewal: z.ZodOptional<z.ZodNumber>;
    stripeSubscriptionId: z.ZodOptional<z.ZodString>;
    stripeCustomerId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type UserSubscriptionResponseDTO = z.infer<typeof UserSubscriptionResponseDTOSchema>;
//# sourceMappingURL=UserSubscriptionResponseDTO.d.ts.map