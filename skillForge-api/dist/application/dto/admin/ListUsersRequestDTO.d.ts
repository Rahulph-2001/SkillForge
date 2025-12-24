import { z } from 'zod';
export declare const ListUsersRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ListUsersRequestDTO = z.infer<typeof ListUsersRequestSchema>;
//# sourceMappingURL=ListUsersRequestDTO.d.ts.map