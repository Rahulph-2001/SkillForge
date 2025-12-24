import { z } from 'zod';
/**
 * Zod schema for Submit MCQ Response DTO
 */
export declare const SubmitMCQResponseDTOSchema: z.ZodObject<{
    attemptId: z.ZodString;
    score: z.ZodNumber;
    passed: z.ZodBoolean;
    correctAnswers: z.ZodNumber;
    totalQuestions: z.ZodNumber;
    passingScore: z.ZodNumber;
    details: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        userAnswer: z.ZodNumber;
        correctAnswer: z.ZodNumber;
        isCorrect: z.ZodBoolean;
        explanation: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SubmitMCQResponseDTO = z.infer<typeof SubmitMCQResponseDTOSchema>;
//# sourceMappingURL=SubmitMCQResponseDTO.d.ts.map