import { z } from 'zod';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';

export const AssignSubscriptionSchema = z.object({
    userId: z.string()
        .uuid('Invalid user ID'),
    planId: z.string()
        .uuid('Invalid plan ID'),
    billingInterval: z.nativeEnum(BillingInterval, {
        message: 'Invalid billing interval',
    }).default(BillingInterval.MONTHLY),
    startTrial: z.boolean()
        .default(false),
    stripeCustomerId: z.string()
        .optional(),
});

export type AssignSubscriptionDTO = z.infer<typeof AssignSubscriptionSchema>;
