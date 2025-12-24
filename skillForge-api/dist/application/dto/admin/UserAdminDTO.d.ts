import { z } from 'zod';
/**
 * Zod schema for User Admin DTO
 */
export declare const UserAdminDTOSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodString;
    credits: z.ZodNumber;
    isActive: z.ZodBoolean;
    isDeleted: z.ZodBoolean;
    emailVerified: z.ZodBoolean;
    avatarUrl: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type UserAdminDTO = z.infer<typeof UserAdminDTOSchema>;
//# sourceMappingURL=UserAdminDTO.d.ts.map