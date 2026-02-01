"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblockCommunityRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Unblock Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates unblock request
 */
exports.UnblockCommunityRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    reason: zod_1.z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});
//# sourceMappingURL=UnblockCommunityRequestDTO.js.map