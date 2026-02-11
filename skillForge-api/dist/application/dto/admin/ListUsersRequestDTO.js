"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersRequestDTOSchema = void 0;
const zod_1 = require("zod");
exports.ListUsersRequestDTOSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid(),
    page: zod_1.z.number().int().positive().optional().default(1),
    limit: zod_1.z.number().int().positive().max(100).optional().default(20),
    search: zod_1.z.string().trim().optional(),
    role: zod_1.z.enum(['user', 'admin']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=ListUsersRequestDTO.js.map