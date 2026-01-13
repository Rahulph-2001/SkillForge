"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProjectsResponseSchema = exports.ListProjectsRequestSchema = void 0;
const zod_1 = require("zod");
exports.ListProjectsRequestSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Open', 'In_Progress', 'Completed', 'Cancelled']).optional(),
    page: zod_1.z.number().int().positive().optional().default(1),
    limit: zod_1.z.number().int().positive().max(100).optional().default(20),
});
exports.ListProjectsResponseSchema = zod_1.z.object({
    projects: zod_1.z.array(zod_1.z.any()), // Will use ProjectResponseDTO
    total: zod_1.z.number().int().nonnegative(),
    page: zod_1.z.number().int().positive(),
    limit: zod_1.z.number().int().positive(),
    totalPages: zod_1.z.number().int().nonnegative(),
});
//# sourceMappingURL=ListProjectsDTO.js.map