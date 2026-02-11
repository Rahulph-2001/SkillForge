import { z } from 'zod';
export declare const PaginationMetadataSchema: z.ZodObject<{
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNextPage: z.ZodBoolean;
    hasPreviousPage: z.ZodBoolean;
}, z.core.$strip>;
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
    pagination: z.ZodObject<{
        total: z.ZodNumber;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNextPage: z.ZodBoolean;
        hasPreviousPage: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ListUsersResponseDTO = z.infer<typeof ListUsersResponseDTOSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;
//# sourceMappingURL=ListUsersResponseDTO.d.ts.map