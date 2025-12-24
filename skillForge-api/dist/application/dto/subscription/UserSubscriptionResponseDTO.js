"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionResponseDTOSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
/**
 * Zod schema for User Subscription Response DTO
 */
exports.UserSubscriptionResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid subscription ID'),
    userId: zod_1.z.string().uuid('Invalid user ID'),
    planId: zod_1.z.string().uuid('Invalid plan ID'),
    planName: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(SubscriptionEnums_1.SubscriptionStatus, {
        message: 'Invalid subscription status',
    }),
    currentPeriodStart: zod_1.z.coerce.date(),
    currentPeriodEnd: zod_1.z.coerce.date(),
    cancelAt: zod_1.z.coerce.date().optional(),
    canceledAt: zod_1.z.coerce.date().optional(),
    trialStart: zod_1.z.coerce.date().optional(),
    trialEnd: zod_1.z.coerce.date().optional(),
    isInTrial: zod_1.z.boolean(),
    hasExpired: zod_1.z.boolean(),
    willCancelAtPeriodEnd: zod_1.z.boolean(),
    daysUntilRenewal: zod_1.z.number().int().optional(),
    stripeSubscriptionId: zod_1.z.string().optional(),
    stripeCustomerId: zod_1.z.string().optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=UserSubscriptionResponseDTO.js.map