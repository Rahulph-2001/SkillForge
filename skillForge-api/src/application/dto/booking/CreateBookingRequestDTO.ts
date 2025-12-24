import { z } from 'zod';

export const CreateBookingRequestSchema = z.object({
  learnerId: z.string().uuid('Invalid learner ID'),
  skillId: z.string().uuid('Invalid skill ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  preferredDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  preferredTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24-hour)'),
  message: z.string()
    .max(500, 'Message must not exceed 500 characters')
    .trim()
    .optional(),
});

export type CreateBookingRequestDTO = z.infer<typeof CreateBookingRequestSchema>;
