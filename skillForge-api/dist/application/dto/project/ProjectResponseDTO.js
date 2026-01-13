"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Project Response DTO
 */
exports.ProjectResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid project ID'),
    clientId: zod_1.z.string().uuid('Invalid client ID'),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    tags: zod_1.z.array(zod_1.z.string()),
    budget: zod_1.z.number().nonnegative('Budget must be non-negative'),
    duration: zod_1.z.string().min(1, 'Duration is required'),
    deadline: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').nullable().optional(),
    status: zod_1.z.enum(['Open', 'In_Progress', 'Completed', 'Cancelled']),
    paymentId: zod_1.z.string().uuid('Invalid payment ID').nullable().optional(),
    applicationsCount: zod_1.z.number().int().nonnegative('Applications count must be non-negative'),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    // Client information (optional, populated when needed)
    client: zod_1.z.object({
        name: zod_1.z.string(),
        avatar: zod_1.z.string().nullable().optional(),
        rating: zod_1.z.number().nullable().optional(),
        isVerified: zod_1.z.boolean().optional(),
    }).optional(),
});
//# sourceMappingURL=ProjectResponseDTO.js.map