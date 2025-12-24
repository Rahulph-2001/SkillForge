"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSkillTemplateSchema = void 0;
const zod_1 = require("zod");
exports.CreateSkillTemplateSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title too long')
        .trim(),
    category: zod_1.z.string()
        .min(2, 'Category is required')
        .max(100, 'Category too long')
        .trim(),
    description: zod_1.z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description too long')
        .trim(),
    creditsMin: zod_1.z.number()
        .int('Must be an integer')
        .min(1, 'Minimum credits must be at least 1'),
    creditsMax: zod_1.z.number()
        .int('Must be an integer')
        .min(1, 'Maximum credits must be at least 1'),
    mcqCount: zod_1.z.number()
        .int('Must be an integer')
        .min(5, 'At least 5 questions required')
        .max(100, 'Maximum 100 questions allowed'),
    passRange: zod_1.z.number()
        .int('Must be an integer')
        .min(1, 'Pass percentage must be at least 1')
        .max(100, 'Pass percentage cannot exceed 100')
        .default(70),
    levels: zod_1.z.array(zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
        message: 'Invalid level',
    }))
        .min(1, 'At least one level is required')
        .max(4, 'Maximum 4 levels allowed'),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50, 'Tag too long'))
        .max(10, 'Maximum 10 tags allowed')
        .default([]),
    status: zod_1.z.enum(['Active', 'Inactive'], {
        message: 'Invalid status',
    }).optional().default('Active'),
}).refine((data) => data.creditsMin <= data.creditsMax, {
    message: 'Minimum credits cannot be greater than maximum credits',
    path: ['creditsMax'],
});
//# sourceMappingURL=CreateSkillTemplateDTO.js.map