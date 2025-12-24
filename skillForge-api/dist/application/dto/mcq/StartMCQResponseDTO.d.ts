import { z } from 'zod';
/**
 * Zod schema for MCQ Question DTO
 */
export declare const MCQQuestionDTOSchema: z.ZodObject<{
    id: z.ZodString;
    question: z.ZodString;
    options: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type MCQQuestionDTO = z.infer<typeof MCQQuestionDTOSchema>;
/**
 * Zod schema for Start MCQ Response DTO
 */
export declare const StartMCQResponseDTOSchema: z.ZodObject<{
    skillId: z.ZodString;
    templateId: z.ZodString;
    level: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        question: z.ZodString;
        options: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    totalQuestions: z.ZodNumber;
    passingScore: z.ZodNumber;
}, z.core.$strip>;
export type StartMCQResponseDTO = z.infer<typeof StartMCQResponseDTOSchema>;
//# sourceMappingURL=StartMCQResponseDTO.d.ts.map