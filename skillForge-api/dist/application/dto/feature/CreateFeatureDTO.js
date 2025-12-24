"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeatureSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
exports.CreateFeatureSchema = zod_1.z.object({
    planId: zod_1.z.string()
        .uuid('Invalid plan ID')
        .optional(),
    name: zod_1.z.string()
        .min(1, 'Feature name is required')
        .max(255, 'Feature name too long')
        .trim(),
    description: zod_1.z.string()
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    featureType: zod_1.z.nativeEnum(SubscriptionEnums_1.FeatureType, {
        message: 'Invalid feature type',
    }),
    limitValue: zod_1.z.number()
        .int('Limit value must be an integer')
        .min(0, 'Limit value must be positive')
        .optional(),
    isEnabled: zod_1.z.boolean()
        .default(true),
    isHighlighted: zod_1.z.boolean()
        .default(false),
    displayOrder: zod_1.z.number()
        .int('Display order must be an integer')
        .min(0, 'Display order must be non-negative')
        .default(0),
}).refine((data) => {
    // NUMERIC_LIMIT must have a limit value
    if (data.featureType === SubscriptionEnums_1.FeatureType.NUMERIC_LIMIT && data.limitValue === undefined) {
        return false;
    }
    return true;
}, {
    message: 'NUMERIC_LIMIT feature must have a limit value',
    path: ['limitValue'],
});
//# sourceMappingURL=CreateFeatureDTO.js.map