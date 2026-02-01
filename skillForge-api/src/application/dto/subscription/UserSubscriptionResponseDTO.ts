import { z } from 'zod';
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionEnums';

/**
 * Zod schema for User Subscription Response DTO
 */
export const UserSubscriptionResponseDTOSchema = z.object({
    id: z.string().uuid('Invalid subscription ID'),
    userId: z.string().uuid('Invalid user ID'),
    planId: z.string().uuid('Invalid plan ID'),
    planName: z.string().optional(),
    status: z.nativeEnum(SubscriptionStatus, {
        message: 'Invalid subscription status',
    }),
    currentPeriodStart: z.coerce.date(),
    currentPeriodEnd: z.coerce.date(),
    cancelAt: z.coerce.date().optional(),
    canceledAt: z.coerce.date().optional(),
    trialStart: z.coerce.date().optional(),
    trialEnd: z.coerce.date().optional(),
    isInTrial: z.boolean(),
    hasExpired: z.boolean(),
    willCancelAtPeriodEnd: z.boolean(),
    daysUntilRenewal: z.number().int().optional(),
    stripeSubscriptionId: z.string().optional(),
    stripeCustomerId: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    usage: z.array(z.object({
        feature: z.string(),
        used: z.number(),
        limit: z.number().nullable(),
    })).optional(),
});

export type UserSubscriptionResponseDTO = z.infer<typeof UserSubscriptionResponseDTOSchema>;
