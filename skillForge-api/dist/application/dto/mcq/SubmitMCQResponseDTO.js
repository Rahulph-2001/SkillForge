"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitMCQResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Submit MCQ Response DTO
 */
exports.SubmitMCQResponseDTOSchema = zod_1.z.object({
    attemptId: zod_1.z.string().uuid('Invalid attempt ID'),
    score: zod_1.z.number().min(0).max(100, 'Score must be between 0 and 100'),
    passed: zod_1.z.boolean(),
    correctAnswers: zod_1.z.number().int().min(0, 'Correct answers must be non-negative'),
    totalQuestions: zod_1.z.number().int().min(1, 'Total questions must be at least 1'),
    passingScore: zod_1.z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
    details: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string().uuid('Invalid question ID'),
        userAnswer: zod_1.z.number().int().min(0, 'User answer must be non-negative'),
        correctAnswer: zod_1.z.number().int().min(0, 'Correct answer must be non-negative'),
        isCorrect: zod_1.z.boolean(),
        explanation: zod_1.z.string().optional(),
    })),
});
//# sourceMappingURL=SubmitMCQResponseDTO.js.map