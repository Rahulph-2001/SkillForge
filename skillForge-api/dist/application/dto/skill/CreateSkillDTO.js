"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSkillSchema = void 0;
const zod_1 = require("zod");
exports.CreateSkillSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title must not exceed 255 characters')
        .trim(),
    description: zod_1.z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .trim(),
    category: zod_1.z.string()
        .min(2, 'Category is required')
        .max(100, 'Category must not exceed 100 characters')
        .trim(),
    level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
        message: 'Invalid skill level',
    }),
    durationHours: zod_1.z.number()
        .int('Duration must be a whole number')
        .min(1, 'Duration must be at least 1 hour')
        .max(100, 'Duration cannot exceed 100 hours'),
    creditsHour: zod_1.z.number()
        .int('Credits must be a whole number')
        .min(1, 'Credits must be at least 1 per hour')
        .max(1000, 'Credits cannot exceed 1000 per hour'),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50, 'Tag too long'))
        .max(10, 'Maximum 10 tags allowed')
        .default([]),
    templateId: zod_1.z.string()
        .uuid('Invalid template ID')
        .optional(),
});
//# sourceMappingURL=CreateSkillDTO.js.map