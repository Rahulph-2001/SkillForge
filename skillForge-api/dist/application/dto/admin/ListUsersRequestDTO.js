"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersRequestSchema = void 0;
const zod_1 = require("zod");
exports.ListUsersRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
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
    search: zod_1.z.string()
        .max(255, 'Search query too long')
        .trim()
        .optional(),
    role: zod_1.z.enum(['user', 'admin'], {
        message: 'Invalid role',
    }).optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=ListUsersRequestDTO.js.map