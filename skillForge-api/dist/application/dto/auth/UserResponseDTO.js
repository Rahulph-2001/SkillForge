"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for User Response DTO
 */
exports.UserResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid user ID'),
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    role: zod_1.z.string().min(1, 'Role is required'),
    credits: zod_1.z.number().int().min(0, 'Credits must be non-negative'),
    verification: zod_1.z.object({
        email_verified: zod_1.z.boolean(),
    }),
    subscriptionPlan: zod_1.z.string().min(1, 'Subscription plan is required'),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').nullable(),
});
//# sourceMappingURL=UserResponseDTO.js.map