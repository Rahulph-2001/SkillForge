"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for User Admin DTO
 */
exports.UserAdminDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid user ID'),
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    role: zod_1.z.string().min(1, 'Role is required'),
    credits: zod_1.z.number().int().min(0, 'Credits must be non-negative'),
    isActive: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean(),
    emailVerified: zod_1.z.boolean(),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').nullable(),
});
//# sourceMappingURL=UserAdminDTO.js.map