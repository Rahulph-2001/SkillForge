"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingSkillDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Pending Skill DTO
 */
exports.PendingSkillDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid skill ID'),
    providerId: zod_1.z.string().uuid('Invalid provider ID'),
    providerName: zod_1.z.string().min(1, 'Provider name is required'),
    providerEmail: zod_1.z.string().email('Invalid email address'),
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
    verificationStatus: zod_1.z.string().nullable(),
    mcqScore: zod_1.z.number().min(0).max(100).nullable(),
    mcqTotalQuestions: zod_1.z.number().int().min(0).nullable(),
    mcqPassingScore: zod_1.z.number().min(0).max(100).nullable(),
    verifiedAt: zod_1.z.coerce.date().nullable(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=PendingSkillDTO.js.map