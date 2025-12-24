"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanDTOSchema = exports.SubscriptionFeatureDTOSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
/**
 * Zod schema for Subscription Feature DTO
 */
exports.SubscriptionFeatureDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid feature ID'),
    name: zod_1.z.string().min(1, 'Feature name is required'),
    description: zod_1.z.string().optional(),
    featureType: zod_1.z.nativeEnum(SubscriptionEnums_1.FeatureType, {
        message: 'Invalid feature type',
    }),
    limitValue: zod_1.z.number().min(0).optional(),
    isEnabled: zod_1.z.boolean(),
    displayOrder: zod_1.z.number().min(0),
    isHighlighted: zod_1.z.boolean(),
});
/**
 * Zod schema for Subscription Plan DTO
 */
exports.SubscriptionPlanDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid plan ID'),
    name: zod_1.z.string().min(1, 'Plan name is required'),
    price: zod_1.z.number().min(0, 'Price must be non-negative'),
    projectPosts: zod_1.z.number().nullable(),
    createCommunity: zod_1.z.number().nullable(),
    features: zod_1.z.array(exports.SubscriptionFeatureDTOSchema),
    badge: zod_1.z.enum(['Free', 'Starter', 'Professional', 'Enterprise']),
    color: zod_1.z.string().min(1, 'Color is required'),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=SubscriptionPlanDTO.js.map