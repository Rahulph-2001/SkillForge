"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionPlansResponseDTOSchema = void 0;
const zod_1 = require("zod");
const SubscriptionPlanDTO_1 = require("./SubscriptionPlanDTO");
exports.ListSubscriptionPlansResponseDTOSchema = zod_1.z.object({
    plans: zod_1.z.array(SubscriptionPlanDTO_1.SubscriptionPlanDTOSchema),
    total: zod_1.z.number().int().min(0, 'Total must be non-negative'),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
    hasNextPage: zod_1.z.boolean(),
    hasPreviousPage: zod_1.z.boolean(),
});
//# sourceMappingURL=ListSubscriptionPlansResponseDTO.js.map