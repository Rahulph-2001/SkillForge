"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCommunityRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Block Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates block request
 */
exports.BlockCommunityRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    reason: zod_1.z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});
//# sourceMappingURL=BlockCommunityRequestDTO.js.map