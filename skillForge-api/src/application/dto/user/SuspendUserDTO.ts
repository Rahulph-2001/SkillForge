import { z } from 'zod';

export const SuspendUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason too long')
    .trim(),
  suspendedUntil: z.string()
    .datetime('Invalid date format (use ISO 8601)')
    .optional(),
});

export type SuspendUserDTO = z.infer<typeof SuspendUserSchema>;