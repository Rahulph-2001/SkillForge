import { z } from 'zod';
export declare const ValidateSessionTimeResponseSchema: z.ZodObject<{
    canJoin: z.ZodBoolean;
    message: z.ZodString;
    sessionStartAt: z.ZodDate;
    sessionEndAt: z.ZodDate;
    remainingSeconds: z.ZodNumber;
    sessionDurationMinutes: z.ZodNumber;
}, z.core.$strip>;
export type ValidateSessionTimeResponseDTO = z.infer<typeof ValidateSessionTimeResponseSchema>;
//# sourceMappingURL=ValidateSessionTimeDTO.d.ts.map