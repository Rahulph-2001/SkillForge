import { z } from 'zod';

/**
 * Zod schema for Delete Community Request DTO (Admin)
 * Following Single Responsibility Principle - only validates delete request
 */
export const DeleteCommunityRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    communityId: z.string().uuid('Invalid community ID'),
    reason: z.string()
        .max(500, 'Reason too long')
        .trim()
        .optional(),
});

export type DeleteCommunityRequestDTO = z.infer<typeof DeleteCommunityRequestSchema>;
