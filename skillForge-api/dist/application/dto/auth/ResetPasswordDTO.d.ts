import { z } from 'zod';
export declare const ResetPasswordSchema: z.ZodObject<{
    email: z.ZodString;
    otpCode: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
//# sourceMappingURL=ResetPasswordDTO.d.ts.map