
import { z } from 'zod';

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(['SHORTLISTED', 'ACCEPTED', 'REJECTED']),
});

export type UpdateApplicationStatusDTO = z.infer<typeof UpdateApplicationStatusSchema>;