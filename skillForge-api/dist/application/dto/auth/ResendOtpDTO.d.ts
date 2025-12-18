import { z } from 'zod';
export declare const ResendOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ResendOtpDTO = z.infer<typeof ResendOtpSchema>;
//# sourceMappingURL=ResendOtpDTO.d.ts.map