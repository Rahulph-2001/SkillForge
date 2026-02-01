import { z } from 'zod';
/**
 * Zod schema for List Communities Request DTO (Admin)
 */
export declare const ListCommunitiesRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ListCommunitiesRequestDTO = z.infer<typeof ListCommunitiesRequestSchema>;
//# sourceMappingURL=ListCommunitiesRequestDTO.d.ts.map