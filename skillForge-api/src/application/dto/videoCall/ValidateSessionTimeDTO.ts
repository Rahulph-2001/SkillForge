import { z } from 'zod';

export const ValidateSessionTimeResponseSchema = z.object({
  canJoin: z.boolean(),
  message: z.string(),
  sessionStartAt: z.date(),
  sessionEndAt: z.date(),
  remainingSeconds: z.number(),
  sessionDurationMinutes: z.number(),
});

export type ValidateSessionTimeResponseDTO = z.infer<typeof ValidateSessionTimeResponseSchema>;