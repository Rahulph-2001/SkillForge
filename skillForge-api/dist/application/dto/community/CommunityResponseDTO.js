"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Community Response DTO
 */
exports.CommunityResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid community ID'),
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    imageUrl: zod_1.z.string().url('Invalid image URL').nullable(),
    videoUrl: zod_1.z.string().url('Invalid video URL').nullable(),
    adminId: zod_1.z.string().uuid('Invalid admin ID'),
    creditsCost: zod_1.z.number().min(0, 'Credits cost must be non-negative'),
    creditsPeriod: zod_1.z.string().min(1, 'Credits period is required'),
    membersCount: zod_1.z.number().int().min(0, 'Members count must be non-negative'),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    isJoined: zod_1.z.boolean().optional(),
    isAdmin: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=CommunityResponseDTO.js.map