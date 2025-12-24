import { z } from 'zod';
/**
 * Zod schema for List Users Response DTO
 */
export declare const ListUsersResponseDTOSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodString;
        credits: z.ZodNumber;
        isActive: z.ZodBoolean;
        isDeleted: z.ZodBoolean;
        emailVerified: z.ZodBoolean;
        avatarUrl: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type ListUsersResponseDTO = z.infer<typeof ListUsersResponseDTOSchema>;
//# sourceMappingURL=ListUsersResponseDTO.d.ts.map