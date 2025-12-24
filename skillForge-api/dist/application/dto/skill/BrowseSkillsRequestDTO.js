"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseSkillsRequestSchema = void 0;
const zod_1 = require("zod");
exports.BrowseSkillsRequestSchema = zod_1.z.object({
    category: zod_1.z.string()
        .max(100, 'Category too long')
        .optional(),
    level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
        message: 'Invalid skill level',
    }).optional(),
    search: zod_1.z.string()
        .max(255, 'Search query too long')
        .trim()
        .optional(),
    minCredits: zod_1.z.number()
        .int('Must be an integer')
        .min(0, 'Cannot be negative')
        .optional(),
    maxCredits: zod_1.z.number()
        .int('Must be an integer')
        .min(0, 'Cannot be negative')
        .optional(),
    page: zod_1.z.number()
        .int('Page must be an integer')
        .min(1, 'Page must be at least 1')
        .optional()
        .default(1),
    limit: zod_1.z.number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .optional()
        .default(20),
    sortBy: zod_1.z.enum(['rating', 'credits', 'createdAt'], {
        message: 'Invalid sort field',
    }).optional().default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc'], {
        message: 'Invalid sort order',
    }).optional().default('desc'),
}).refine((data) => {
    if (data.minCredits !== undefined && data.maxCredits !== undefined) {
        return data.minCredits <= data.maxCredits;
    }
    return true;
}, {
    message: 'Min credits cannot be greater than max credits',
    path: ['maxCredits'],
});
//# sourceMappingURL=BrowseSkillsRequestDTO.js.map