"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectApplicationResponseDTOSchema = void 0;
const zod_1 = require("zod");
exports.ProjectApplicationResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    projectId: zod_1.z.string().uuid(),
    applicantId: zod_1.z.string().uuid(),
    coverLetter: zod_1.z.string(),
    proposedBudget: zod_1.z.number().nullable(),
    proposedDuration: zod_1.z.string().nullable(),
    status: zod_1.z.string(),
    matchScore: zod_1.z.number().nullable(),
    matchAnalysis: zod_1.z.any().nullable(),
    applicant: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        avatarUrl: zod_1.z.string().nullable(),
        rating: zod_1.z.number(),
        reviewCount: zod_1.z.number(),
        skillsOffered: zod_1.z.array(zod_1.z.string()),
    }).optional(),
    project: zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string(),
        budget: zod_1.z.number(),
        duration: zod_1.z.string(),
    }).optional(),
    interviews: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        scheduledAt: zod_1.z.coerce.date(),
        durationMinutes: zod_1.z.number(),
        status: zod_1.z.string(),
        videoCallRoomId: zod_1.z.string().nullable().optional(),
    })).optional(),
    appliedAt: zod_1.z.coerce.date(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    reviewedAt: zod_1.z.coerce.date().nullable(),
});
//# sourceMappingURL=ProjectApplicationResponseDTO.js.map