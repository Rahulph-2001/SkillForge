"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSuspendProjectResponseDTOSchema = exports.AdminSuspendProjectRequestDTOSchema = void 0;
const zod_1 = require("zod");
exports.AdminSuspendProjectRequestDTOSchema = zod_1.z.object({
    reason: zod_1.z.string().min(10, 'Reason must be at least 10 characters'),
    withRefund: zod_1.z.boolean().default(false),
});
exports.AdminSuspendProjectResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    isSuspended: zod_1.z.boolean(),
    suspendedAt: zod_1.z.coerce.date(),
    suspendReason: zod_1.z.string(),
    refundProcessed: zod_1.z.boolean(),
});
//# sourceMappingURL=AdminSuspendProjectDTO.js.map