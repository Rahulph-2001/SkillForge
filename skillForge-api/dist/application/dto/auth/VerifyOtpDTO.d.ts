import { z } from 'zod';
export declare const VerifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otpCode: z.ZodString;
}, z.core.$strip>;
export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;
//# sourceMappingURL=VerifyOtpDTO.d.ts.map