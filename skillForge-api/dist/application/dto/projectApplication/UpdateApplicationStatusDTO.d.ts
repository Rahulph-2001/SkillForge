import { z } from 'zod';
export declare const UpdateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        SHORTLISTED: "SHORTLISTED";
        ACCEPTED: "ACCEPTED";
        REJECTED: "REJECTED";
    }>;
}, z.core.$strip>;
export type UpdateApplicationStatusDTO = z.infer<typeof UpdateApplicationStatusSchema>;
//# sourceMappingURL=UpdateApplicationStatusDTO.d.ts.map