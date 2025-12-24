"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPublicSubscriptionPlansResponseDTOSchema = void 0;
const zod_1 = require("zod");
const SubscriptionPlanDTO_1 = require("./SubscriptionPlanDTO");
/**
 * Zod schema for List Public Subscription Plans Response DTO
 */
exports.ListPublicSubscriptionPlansResponseDTOSchema = zod_1.z.object({
    plans: zod_1.z.array(SubscriptionPlanDTO_1.SubscriptionPlanDTOSchema),
    total: zod_1.z.number().int().min(0, 'Total must be non-negative'),
});
//# sourceMappingURL=ListPublicSubscriptionPlansResponseDTO.js.map