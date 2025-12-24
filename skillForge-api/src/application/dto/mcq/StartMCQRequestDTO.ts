import { z } from 'zod';

export const StartMCQRequestSchema = z.object({
  skillId: z.string().uuid('Invalid skill ID'),
  userId: z.string().uuid('Invalid user ID'),
});

export type StartMCQRequestDTO = z.infer<typeof StartMCQRequestSchema>;
