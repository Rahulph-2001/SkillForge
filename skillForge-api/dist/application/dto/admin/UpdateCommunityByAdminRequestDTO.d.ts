import { z } from 'zod';
/**
 * Zod schema for Update Community By Admin Request DTO
 * Following Single Responsibility Principle - only validates update request
 */
export declare const UpdateCommunityByAdminRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    communityId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    creditsCost: z.ZodOptional<z.ZodNumber>;
    creditsPeriod: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateCommunityByAdminRequestDTO = z.infer<typeof UpdateCommunityByAdminRequestSchema>;
//# sourceMappingURL=UpdateCommunityByAdminRequestDTO.d.ts.map