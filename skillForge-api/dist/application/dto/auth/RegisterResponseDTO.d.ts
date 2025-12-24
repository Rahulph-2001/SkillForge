import { z } from 'zod';
/**
 * Zod schema for Register Response DTO
 */
export declare const RegisterResponseDTOSchema: z.ZodObject<{
    email: z.ZodString;
    expiresAt: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export type RegisterResponseDTO = z.infer<typeof RegisterResponseDTOSchema>;
//# sourceMappingURL=RegisterResponseDTO.d.ts.map