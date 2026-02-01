import { z } from 'zod';
export declare const CreateProjectApplicationSchema: z.ZodObject<{
    projectId: z.ZodString;
    coverLetter: z.ZodString;
    proposedBudget: z.ZodOptional<z.ZodNumber>;
    proposedDuration: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateProjectApplicationDTO = z.infer<typeof CreateProjectApplicationSchema>;
//# sourceMappingURL=CreateProjectApplicationDTO.d.ts.map