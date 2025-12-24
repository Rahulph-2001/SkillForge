import { z } from 'zod';
export declare const SuspendUserSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodString;
    suspendedUntil: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SuspendUserDTO = z.infer<typeof SuspendUserSchema>;
//# sourceMappingURL=SuspendUserDTO.d.ts.map