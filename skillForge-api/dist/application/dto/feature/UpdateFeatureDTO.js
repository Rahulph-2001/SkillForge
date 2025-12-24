"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeatureSchema = void 0;
const zod_1 = require("zod");
exports.UpdateFeatureSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Feature name is required')
        .max(255, 'Feature name too long')
        .trim()
        .optional(),
    description: zod_1.z.string()
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    limitValue: zod_1.z.number()
        .int('Limit value must be an integer')
        .min(0, 'Limit value must be positive')
        .optional(),
    isEnabled: zod_1.z.boolean()
        .optional(),
    isHighlighted: zod_1.z.boolean()
        .optional(),
    displayOrder: zod_1.z.number()
        .int('Display order must be an integer')
        .min(0, 'Display order must be non-negative')
        .optional(),
});
//# sourceMappingURL=UpdateFeatureDTO.js.map