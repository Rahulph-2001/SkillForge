"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignSubscriptionSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
exports.AssignSubscriptionSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .uuid('Invalid user ID'),
    planId: zod_1.z.string()
        .uuid('Invalid plan ID'),
    billingInterval: zod_1.z.nativeEnum(SubscriptionEnums_1.BillingInterval, {
        message: 'Invalid billing interval',
    }).default(SubscriptionEnums_1.BillingInterval.MONTHLY),
    startTrial: zod_1.z.boolean()
        .default(false),
    stripeCustomerId: zod_1.z.string()
        .optional(),
});
//# sourceMappingURL=AssignSubscriptionDTO.js.map