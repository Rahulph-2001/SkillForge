import { z } from 'zod';

/**
 * Zod schema for Admin List Skills Request DTO
 */
export const AdminListSkillsRequestSchema = z.object({
    adminUserId: z.string().uuid('Invalid admin user ID'),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional(),
    status: z.enum(['in-review', 'approved', 'rejected']).optional(),
    isBlocked: z.boolean().optional(),
});

export type AdminListSkillsRequestDTO = z.infer<typeof AdminListSkillsRequestSchema>;
