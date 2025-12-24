"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateSubscriptionRequestSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
/**
 * Request DTO Schema for subscription activation
 */
exports.ActivateSubscriptionRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    planId: zod_1.z.string().uuid('Invalid plan ID'),
    paymentId: zod_1.z.string().uuid('Invalid payment ID'),
    billingInterval: zod_1.z.nativeEnum(SubscriptionEnums_1.BillingInterval).default(SubscriptionEnums_1.BillingInterval.MONTHLY),
});
//# sourceMappingURL=ActivateSubscriptionDTO.js.map