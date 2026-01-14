import { z } from 'zod';

/**
 * Zod schema for Unblock Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates unblock request
 */
export const UnblockCommunityRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    communityId: z.string().uuid('Invalid community ID'),
    reason: z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});

export type UnblockCommunityRequestDTO = z.infer<typeof UnblockCommunityRequestSchema>;
