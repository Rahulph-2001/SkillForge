"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartMCQResponseDTOSchema = exports.MCQQuestionDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for MCQ Question DTO
 */
exports.MCQQuestionDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid question ID'),
    question: zod_1.z.string().min(1, 'Question is required'),
    options: zod_1.z.array(zod_1.z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
    // No correctAnswer or explanation for security
});
/**
 * Zod schema for Start MCQ Response DTO
 */
exports.StartMCQResponseDTOSchema = zod_1.z.object({
    skillId: zod_1.z.string().uuid('Invalid skill ID'),
    templateId: zod_1.z.string().uuid('Invalid template ID'),
    level: zod_1.z.string().min(1, 'Level is required'),
    questions: zod_1.z.array(exports.MCQQuestionDTOSchema),
    totalQuestions: zod_1.z.number().int().min(1, 'Total questions must be at least 1'),
    passingScore: zod_1.z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
});
//# sourceMappingURL=StartMCQResponseDTO.js.map