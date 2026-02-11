"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseSkillsResponseDTOSchema = exports.BrowseSkillDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Browse Skill DTO
 */
exports.BrowseSkillDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid skill ID'),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    level: zod_1.z.string().min(1, 'Level is required'),
    durationHours: zod_1.z.number().min(0, 'Duration must be non-negative'),
    creditsPerHour: zod_1.z.number().min(0, 'Credits per hour must be non-negative'),
    imageUrl: zod_1.z.string().url('Invalid image URL').nullable(),
    tags: zod_1.z.array(zod_1.z.string()),
    rating: zod_1.z.number().min(0).max(5, 'Rating must be between 0 and 5'),
    totalSessions: zod_1.z.number().int().min(0, 'Total sessions must be non-negative'),
    provider: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid provider ID'),
        name: zod_1.z.string().min(1, 'Provider name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        avatarUrl: zod_1.z.string().nullable().optional(),
        reviewCount: zod_1.z.number().int().min(0).optional(),
    }),
    availableDays: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for Browse Skills Response DTO
 */
exports.BrowseSkillsResponseDTOSchema = zod_1.z.object({
    skills: zod_1.z.array(exports.BrowseSkillDTOSchema),
    total: zod_1.z.number().int().min(0, 'Total must be non-negative'),
    page: zod_1.z.number().int().min(1, 'Page must be at least 1'),
    limit: zod_1.z.number().int().min(1, 'Limit must be at least 1'),
    totalPages: zod_1.z.number().int().min(0, 'Total pages must be non-negative'),
});
//# sourceMappingURL=BrowseSkillsResponseDTO.js.map