"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectRequestSchema = void 0;
const zod_1 = require("zod");
exports.CreateProjectRequestSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must not exceed 255 characters')
        .trim(),
    description: zod_1.z.string()
        .min(1, 'Description is required')
        .max(5000, 'Description must not exceed 5000 characters')
        .trim(),
    category: zod_1.z.string()
        .min(1, 'Category is required')
        .max(100, 'Category must not exceed 100 characters'),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50))
        .min(0, 'Tags cannot be empty array')
        .max(20, 'Maximum 20 tags allowed')
        .optional()
        .default([]),
    budget: zod_1.z.number()
        .positive('Budget must be a positive number')
        .max(10000000, 'Budget is too large'),
    duration: zod_1.z.string()
        .min(1, 'Duration is required')
        .max(100, 'Duration must not exceed 100 characters'),
    deadline: zod_1.z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format')
        .optional()
        .nullable(),
});
//# sourceMappingURL=CreateProjectDTO.js.map