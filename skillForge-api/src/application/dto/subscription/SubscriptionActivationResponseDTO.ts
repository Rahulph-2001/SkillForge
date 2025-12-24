import { z } from 'zod';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';

/**
 * Response DTO Schema for subscription activation
 */
export const SubscriptionActivationResponseSchema = z.object({
    subscriptionId: z.string().uuid(),
    userId: z.string().uuid(),
    planId: z.string().uuid(),
    planName: z.string(),
    planBadge: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    validUntil: z.date(),
    startedAt: z.date(),
});

export type SubscriptionActivationResponseDTO = z.infer<typeof SubscriptionActivationResponseSchema>;
