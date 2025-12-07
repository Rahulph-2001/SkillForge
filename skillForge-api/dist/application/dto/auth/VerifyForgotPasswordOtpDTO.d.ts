import { z } from 'zod';
export declare const VerifyForgotPasswordOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otpCode: z.ZodString;
}, z.core.$strip>;
export type VerifyForgotPasswordOtpDTO = z.infer<typeof VerifyForgotPasswordOtpSchema>;
//# sourceMappingURL=VerifyForgotPasswordOtpDTO.d.ts.map