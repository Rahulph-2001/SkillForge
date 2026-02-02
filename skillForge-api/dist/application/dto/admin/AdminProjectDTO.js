"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListProjectsRequestSchema = void 0;
const zod_1 = require("zod");
// Request DTO for listing admin projects
exports.AdminListProjectsRequestSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Open', 'In_Progress', 'Pending_Completion', 'Payment_Pending', 'Refund_Pending', 'Completed', 'Cancelled']).optional(),
    category: zod_1.z.string().optional(),
});
//# sourceMappingURL=AdminProjectDTO.js.map