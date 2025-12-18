import { z } from 'zod';
export declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;
//# sourceMappingURL=ForgotPasswordDTO.d.ts.map