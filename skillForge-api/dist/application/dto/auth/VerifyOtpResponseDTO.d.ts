import { z } from 'zod';
/**
 * Zod schema for Verify OTP Response DTO
 */
export declare const VerifyOtpResponseDTOSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodString;
        credits: z.ZodNumber;
        verification: z.ZodObject<{
            email_verified: z.ZodBoolean;
        }, z.core.$strip>;
        subscriptionPlan: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    token: z.ZodString;
    refreshToken: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export type VerifyOtpResponseDTO = z.infer<typeof VerifyOtpResponseDTOSchema>;
//# sourceMappingURL=VerifyOtpResponseDTO.d.ts.map