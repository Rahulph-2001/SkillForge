import { z } from 'zod';

/**
 * Zod schema for Block Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates block request
 */
export const BlockCommunityRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    communityId: z.string().uuid('Invalid community ID'),
    reason: z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});

export type BlockCommunityRequestDTO = z.infer<typeof BlockCommunityRequestSchema>;
