import { z } from 'zod';
export declare const SubmitMCQRequestSchema: z.ZodObject<{
    skillId: z.ZodString;
    userId: z.ZodString;
    questionIds: z.ZodArray<z.ZodString>;
    answers: z.ZodArray<z.ZodNumber>;
    timeTaken: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SubmitMCQRequestDTO = z.infer<typeof SubmitMCQRequestSchema>;
//# sourceMappingURL=SubmitMCQRequestDTO.d.ts.map