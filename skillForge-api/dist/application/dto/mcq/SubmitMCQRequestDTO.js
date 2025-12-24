"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitMCQRequestSchema = void 0;
const zod_1 = require("zod");
exports.SubmitMCQRequestSchema = zod_1.z.object({
    skillId: zod_1.z.string().uuid('Invalid skill ID'),
    userId: zod_1.z.string().uuid('Invalid user ID'),
    questionIds: zod_1.z.array(zod_1.z.string().uuid('Invalid question ID'))
        .min(1, 'At least one question is required')
        .max(100, 'Too many questions'),
    answers: zod_1.z.array(zod_1.z.number().int().min(0).max(3, 'Answer must be between 0 and 3'))
        .min(1, 'At least one answer is required')
        .max(100, 'Too many answers'),
    timeTaken: zod_1.z.number()
        .int('Time must be an integer')
        .min(0, 'Time cannot be negative')
        .optional(),
}).refine((data) => data.questionIds.length === data.answers.length, {
    message: 'Number of questions and answers must match',
    path: ['answers'],
});
//# sourceMappingURL=SubmitMCQRequestDTO.js.map