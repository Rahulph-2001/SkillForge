"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionPlansRequestSchema = void 0;
const zod_1 = require("zod");
exports.ListSubscriptionPlansRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    page: zod_1.z.number()
        .int('Page must be an integer')
        .min(1, 'Page must be at least 1')
        .optional()
        .default(1),
    limit: zod_1.z.number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .optional()
        .default(20),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=ListSubscriptionPlansRequestDTO.js.map