"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureResponseDTOSchema = void 0;
const zod_1 = require("zod");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
/**
 * Zod schema for Feature Response DTO
 */
exports.FeatureResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid feature ID'),
    planId: zod_1.z.string().uuid('Invalid plan ID').optional(),
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    featureType: zod_1.z.nativeEnum(SubscriptionEnums_1.FeatureType, {
        message: 'Invalid feature type',
    }),
    limitValue: zod_1.z.number().min(0).optional(),
    isEnabled: zod_1.z.boolean(),
    displayOrder: zod_1.z.number().int().min(0),
    isHighlighted: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=FeatureResponseDTO.js.map