import { z } from 'zod';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';

/**
 * Request DTO Schema for subscription activation
 */
export const ActivateSubscriptionRequestSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    planId: z.string().uuid('Invalid plan ID'),
    paymentId: z.string().uuid('Invalid payment ID'),
    billingInterval: z.nativeEnum(BillingInterval).default(BillingInterval.MONTHLY),
});

export type ActivateSubscriptionRequestDTO = z.infer<typeof ActivateSubscriptionRequestSchema>;

