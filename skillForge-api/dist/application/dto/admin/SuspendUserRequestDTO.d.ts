import { z } from 'zod';
export declare const SuspendUserRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    targetUserId: z.ZodString;
    reason: z.ZodString;
    duration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SuspendUserRequestDTO = z.infer<typeof SuspendUserRequestSchema>;
//# sourceMappingURL=SuspendUserRequestDTO.d.ts.map