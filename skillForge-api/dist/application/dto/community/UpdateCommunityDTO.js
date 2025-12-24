"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommunitySchema = void 0;
const zod_1 = require("zod");
exports.UpdateCommunitySchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(3, 'Community name must be at least 3 characters')
        .max(100, 'Community name must not exceed 100 characters')
        .trim()
        .optional(),
    description: zod_1.z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional(),
    category: zod_1.z.string()
        .min(2, 'Category is required')
        .max(50, 'Category must not exceed 50 characters')
        .trim()
        .optional(),
    creditsCost: zod_1.z.number()
        .int('Credits must be an integer')
        .min(0, 'Credits cannot be negative')
        .optional(),
    creditsPeriod: zod_1.z.string()
        .regex(/^\d+\s+(day|days|month|months)$/, 'Invalid period format (e.g., "30 days")')
        .optional(),
    imageUrl: zod_1.z.string()
        .url('Invalid image URL')
        .optional(),
    videoUrl: zod_1.z.string()
        .url('Invalid video URL')
        .optional(),
});
//# sourceMappingURL=UpdateCommunityDTO.js.map