"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionActivationResponseSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
/**
 * Response DTO Schema for subscription activation
 */
exports.SubscriptionActivationResponseSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    planId: zod_1.z.string().uuid(),
    planName: zod_1.z.string(),
    planBadge: zod_1.z.string(),
    status: zod_1.z.nativeEnum(SubscriptionEnums_1.SubscriptionStatus),
    validUntil: zod_1.z.date(),
    startedAt: zod_1.z.date(),
});
//# sourceMappingURL=SubscriptionActivationResponseDTO.js.map