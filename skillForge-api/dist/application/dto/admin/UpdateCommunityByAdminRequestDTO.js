"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommunityByAdminRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Update Community By Admin Request DTO
 * Following Single Responsibility Principle - only validates update request
 */
exports.UpdateCommunityByAdminRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    name: zod_1.z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name too long')
        .trim()
        .optional(),
    description: zod_1.z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    category: zod_1.z.string()
        .max(100, 'Category too long')
        .trim()
        .optional(),
    creditsCost: zod_1.z.number()
        .int('Credits cost must be an integer')
        .min(0, 'Credits cost must be non-negative')
        .optional(),
    creditsPeriod: zod_1.z.string()
        .max(50, 'Credits period too long')
        .trim()
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=UpdateCommunityByAdminRequestDTO.js.map