import { z } from 'zod';
export declare const UpdateTemplateQuestionSchema: z.ZodObject<{
    level: z.ZodOptional<z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>>;
    question: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodString>>;
    correctAnswer: z.ZodOptional<z.ZodNumber>;
    explanation: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateTemplateQuestionDTO = z.infer<typeof UpdateTemplateQuestionSchema>;
//# sourceMappingURL=UpdateTemplateQuestionDTO.d.ts.map