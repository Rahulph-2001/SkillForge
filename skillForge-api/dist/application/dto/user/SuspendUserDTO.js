"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspendUserSchema = void 0;
const zod_1 = require("zod");
exports.SuspendUserSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    reason: zod_1.z.string()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason too long')
        .trim(),
    suspendedUntil: zod_1.z.string()
        .datetime('Invalid date format (use ISO 8601)')
        .optional(),
});
//# sourceMappingURL=SuspendUserDTO.js.map