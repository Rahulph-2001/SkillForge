"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * DTO for updating a subscription plan
 */
exports.UpdateSubscriptionPlanDTOSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Plan name is required').optional(),
    price: zod_1.z.number().min(0, 'Price must be non-negative').optional(),
    projectPosts: zod_1.z.number().nullable().optional(),
    createCommunity: zod_1.z.number().nullable().optional(),
    features: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid().optional(),
        name: zod_1.z.string().min(1, 'Feature name is required'),
        description: zod_1.z.string().optional(),
        featureType: zod_1.z.enum(['BOOLEAN', 'NUMERIC_LIMIT', 'TEXT']),
        limitValue: zod_1.z.number().min(0).optional(),
        isEnabled: zod_1.z.boolean().default(true),
        displayOrder: zod_1.z.number().min(0).default(0),
        isHighlighted: zod_1.z.boolean().default(false),
    })).optional(),
    badge: zod_1.z.enum(['Free', 'Starter', 'Professional', 'Enterprise']).optional(),
    color: zod_1.z.string().min(1, 'Color is required').optional(),
    description: zod_1.z.string().optional(),
    currency: zod_1.z.string().optional(),
    billingInterval: zod_1.z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME']).optional(),
    trialDays: zod_1.z.number().min(0).optional(),
    isPopular: zod_1.z.boolean().optional(),
    displayOrder: zod_1.z.number().min(0).optional(),
    isPublic: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=UpdateSubscriptionPlanDTO.js.map