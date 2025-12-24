"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Skill Response DTO
 */
exports.SkillResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid skill ID'),
    providerId: zod_1.z.string().uuid('Invalid provider ID'),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    level: zod_1.z.string().min(1, 'Level is required'),
    durationHours: zod_1.z.number().min(0, 'Duration must be non-negative'),
    creditsPerHour: zod_1.z.number().min(0, 'Credits per hour must be non-negative'),
    tags: zod_1.z.array(zod_1.z.string()),
    imageUrl: zod_1.z.string().url('Invalid image URL').nullable(),
    templateId: zod_1.z.string().uuid('Invalid template ID').nullable(),
    status: zod_1.z.string().min(1, 'Status is required'),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=SkillResponseDTO.js.map