import { z } from 'zod';

/**
 * Zod schema for Reschedule Info
 */
const RescheduleInfoSchema = z.object({
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  newTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
  reason: z.string().min(1, 'Reason is required'),
  requestedBy: z.enum(['learner', 'provider']),
  requestedAt: z.coerce.date(),
}).nullable();

/**
 * Zod schema for Booking Response DTO
 */
export const BookingResponseDTOSchema = z.object({
  id: z.string().uuid('Invalid booking ID'),
  skillId: z.string().uuid('Invalid skill ID'),
  skillTitle: z.string().optional(),
  providerId: z.string().uuid('Invalid provider ID'),
  providerName: z.string().optional(),
  providerAvatar: z.string().url('Invalid avatar URL').nullable().optional(),
  learnerId: z.string().uuid('Invalid learner ID'),
  learnerName: z.string().optional(),
  learnerAvatar: z.string().url('Invalid avatar URL').nullable().optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
  duration: z.number().int().min(1).optional(),
  message: z.string().nullable(),
  status: z.string().min(1, 'Status is required'),
  sessionCost: z.number().min(0, 'Session cost must be non-negative'),
  rescheduleInfo: RescheduleInfoSchema.optional(),
  rejectionReason: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type BookingResponseDTO = z.infer<typeof BookingResponseDTOSchema>;
