import { z } from 'zod';
/**
 * Zod schema for Login Response DTO
 */
export declare const LoginResponseDTOSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type LoginResponseDTO = z.infer<typeof LoginResponseDTOSchema>;
//# sourceMappingURL=LoginResponseDTO.d.ts.map