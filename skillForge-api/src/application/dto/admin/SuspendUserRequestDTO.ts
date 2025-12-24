import { z } from 'zod';

export const SuspendUserRequestSchema = z.object({
  adminUserId: z.string().uuid('Invalid admin user ID'),
  targetUserId: z.string().uuid('Invalid target user ID'),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason too long')
    .trim(),
  duration: z.number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration cannot exceed 365 days')
    .optional(),
});

export type SuspendUserRequestDTO = z.infer<typeof SuspendUserRequestSchema>;
