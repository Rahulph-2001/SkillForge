"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectApplicationSchema = void 0;
const zod_1 = require("zod");
exports.CreateProjectApplicationSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project ID'),
    coverLetter: zod_1.z.string()
        .min(50, 'Cover letter must be at least 50 characters')
        .max(5000, 'Cover letter must not exceed 5000 characters')
        .trim(),
    proposedBudget: zod_1.z.number().positive('Budget must be positive').optional(),
    proposedDuration: zod_1.z.string().max(100).optional(),
});
//# sourceMappingURL=CreateProjectApplicationDTO.js.map