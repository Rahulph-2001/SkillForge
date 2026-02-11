import { z } from 'zod';
import { PendingSkillDTOSchema } from './PendingSkillDTO';

/**
 * Extended Pending Skill DTO with admin-specific fields
 */
export const AdminSkillDTOSchema = PendingSkillDTOSchema.extend({
    isBlocked: z.boolean(),
    blockedReason: z.string().nullable(),
    blockedAt: z.coerce.date().nullable(),
    totalSessions: z.number().int().min(0),
    rating: z.number().min(0).max(5),
    rejectionReason: z.string().nullable(),
});

export type AdminSkillDTO = z.infer<typeof AdminSkillDTOSchema>;
