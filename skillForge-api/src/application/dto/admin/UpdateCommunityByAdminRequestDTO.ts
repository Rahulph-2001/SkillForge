import { z } from 'zod';

/**
 * Zod schema for Update Community By Admin Request DTO
 * Following Single Responsibility Principle - only validates update request
 */
export const UpdateCommunityByAdminRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    communityId: z.string().uuid('Invalid community ID'),
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name too long')
        .trim()
        .optional(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description too long')
        .trim()
        .optional(),
    category: z.string()
        .max(100, 'Category too long')
        .trim()
        .optional(),
    creditsCost: z.number()
        .int('Credits cost must be an integer')
        .min(0, 'Credits cost must be non-negative')
        .optional(),
    creditsPeriod: z.string()
        .max(50, 'Credits period too long')
        .trim()
        .optional(),
    isActive: z.boolean().optional(),
});

export type UpdateCommunityByAdminRequestDTO = z.infer<typeof UpdateCommunityByAdminRequestSchema>;
