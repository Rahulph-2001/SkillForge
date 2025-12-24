import { z } from 'zod';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';
/**
 * Response DTO Schema for subscription activation
 */
export declare const SubscriptionActivationResponseSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    userId: z.ZodString;
    planId: z.ZodString;
    planName: z.ZodString;
    planBadge: z.ZodString;
    status: z.ZodEnum<typeof SubscriptionStatus>;
    validUntil: z.ZodDate;
    startedAt: z.ZodDate;
}, z.core.$strip>;
export type SubscriptionActivationResponseDTO = z.infer<typeof SubscriptionActivationResponseSchema>;
//# sourceMappingURL=SubscriptionActivationResponseDTO.d.ts.map