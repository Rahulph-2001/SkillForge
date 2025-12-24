import { z } from 'zod';
export declare const CreateTemplateQuestionSchema: z.ZodObject<{
    templateId: z.ZodString;
    level: z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>;
    question: z.ZodString;
    options: z.ZodArray<z.ZodString>;
    correctAnswer: z.ZodNumber;
    explanation: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateTemplateQuestionDTO = z.infer<typeof CreateTemplateQuestionSchema>;
//# sourceMappingURL=CreateTemplateQuestionDTO.d.ts.map