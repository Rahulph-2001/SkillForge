"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspendUserRequestSchema = void 0;
const zod_1 = require("zod");
exports.SuspendUserRequestSchema = zod_1.z.object({
    adminUserId: zod_1.z.string().uuid('Invalid admin user ID'),
    targetUserId: zod_1.z.string().uuid('Invalid target user ID'),
    reason: zod_1.z.string()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason too long')
        .trim(),
    duration: zod_1.z.number()
        .int('Duration must be an integer')
        .min(1, 'Duration must be at least 1 day')
        .max(365, 'Duration cannot exceed 365 days')
        .optional(),
});
//# sourceMappingURL=SuspendUserRequestDTO.js.map