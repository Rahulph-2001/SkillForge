import { z } from 'zod';

export const AdminSuspendProjectRequestDTOSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  withRefund: z.boolean().default(false),
});

export type AdminSuspendProjectRequestDTO = z.infer<typeof AdminSuspendProjectRequestDTOSchema>;

export const AdminSuspendProjectResponseDTOSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  isSuspended: z.boolean(),
  suspendedAt: z.coerce.date(),
  suspendReason: z.string(),
  refundProcessed: z.boolean(),
});

export type AdminSuspendProjectResponseDTO = z.infer<typeof AdminSuspendProjectResponseDTOSchema>;