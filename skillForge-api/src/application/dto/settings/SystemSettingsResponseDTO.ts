import { z } from 'zod';

export const SystemSettingsResponseSchema = z.object({
    id: z.string().uuid(),
    key: z.string(),
    value: z.string(),
    description: z.string().nullable(),
    updatedBy: z.string().nullable(),
    updatedAt: z.coerce.date(),
});

export type SystemSettingsResponseDTO = z.infer<typeof SystemSettingsResponseSchema>;
