import { z } from 'zod';
/**
 * Zod schema for User Response DTO
 */
export declare const UserResponseDTOSchema: z.ZodObject<{
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
export type UserResponseDTO = z.infer<typeof UserResponseDTOSchema>;
//# sourceMappingURL=UserResponseDTO.d.ts.map