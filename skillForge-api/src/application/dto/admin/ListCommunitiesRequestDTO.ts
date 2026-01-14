import { z } from 'zod';

/**
 * Zod schema for List Communities Request DTO (Admin)
 */
export const ListCommunitiesRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    page: z.number()
        .int('Page must be an integer')
        .min(1, 'Page must be at least 1')
        .optional()
        .default(1),
    limit: z.number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .optional()
        .default(20),
    search: z.string()
        .max(255, 'Search query too long')
        .trim()
        .optional(),
    category: z.string()
        .max(100, 'Category too long')
        .trim()
        .optional(),
    isActive: z.boolean().optional(),
});

export type ListCommunitiesRequestDTO = z.infer<typeof ListCommunitiesRequestSchema>;
