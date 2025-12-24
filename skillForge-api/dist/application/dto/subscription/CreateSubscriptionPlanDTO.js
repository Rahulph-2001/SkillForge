"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionPlanDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * DTO for creating a subscription plan
 */
exports.CreateSubscriptionPlanDTOSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Plan name is required'),
    price: zod_1.z.number().min(0, 'Price must be non-negative'),
    projectPosts: zod_1.z.number().nullable().optional(),
    createCommunity: zod_1.z.number().nullable().optional(),
    features: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid().optional(), // If provided, might be a library feature or existing feature
        name: zod_1.z.string().min(1, 'Feature name is required'),
        description: zod_1.z.string().optional(),
        featureType: zod_1.z.enum(['BOOLEAN', 'NUMERIC_LIMIT', 'TEXT']),
        limitValue: zod_1.z.number().min(0).optional(),
        isEnabled: zod_1.z.boolean().default(true),
        displayOrder: zod_1.z.number().min(0).default(0),
        isHighlighted: zod_1.z.boolean().default(false),
    })).optional().default([]),
    badge: zod_1.z.enum(['Free', 'Starter', 'Professional', 'Enterprise']),
    color: zod_1.z.string().min(1, 'Color is required'),
    description: zod_1.z.string().optional(),
    currency: zod_1.z.string().optional().default('INR'),
    billingInterval: zod_1.z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME']).optional().default('MONTHLY'),
    trialDays: zod_1.z.number().min(0).optional().default(0),
    isPopular: zod_1.z.boolean().optional().default(false),
    displayOrder: zod_1.z.number().min(0).optional().default(0),
    isPublic: zod_1.z.boolean().optional().default(true),
});
//# sourceMappingURL=CreateSubscriptionPlanDTO.js.map