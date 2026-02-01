"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommunityRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Delete Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates delete request
 */
exports.DeleteCommunityRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    communityId: zod_1.z.string().uuid('Invalid community ID'),
    reason: zod_1.z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});
//# sourceMappingURL=DeleteCommunityRequestDTO.js.map