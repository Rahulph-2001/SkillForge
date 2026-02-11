"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListSkillsRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Admin List Skills Request DTO
 */
exports.AdminListSkillsRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    page: zod_1.z.number().int().min(1).optional().default(1),
    limit: zod_1.z.number().int().min(1).max(100).optional().default(10),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['in-review', 'approved', 'rejected']).optional(),
    isBlocked: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=AdminListSkillsRequestDTO.js.map