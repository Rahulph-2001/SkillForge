import { z } from 'zod';
export declare const StartMCQRequestSchema: z.ZodObject<{
    skillId: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
export type StartMCQRequestDTO = z.infer<typeof StartMCQRequestSchema>;
//# sourceMappingURL=StartMCQRequestDTO.d.ts.map