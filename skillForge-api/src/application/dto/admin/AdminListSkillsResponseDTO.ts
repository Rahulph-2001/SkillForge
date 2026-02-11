import { z } from 'zod';
import { AdminSkillDTOSchema } from './AdminSkillDTO';

/**
 * Zod schema for Admin List Skills Response DTO
 */
export const AdminListSkillsResponseDTOSchema = z.object({
    skills: z.array(AdminSkillDTOSchema),
    total: z.number().int().min(0, 'Total must be non-negative'),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
});

export type AdminListSkillsResponseDTO = z.infer<typeof AdminListSkillsResponseDTOSchema>;
