import { z } from 'zod';
import { NotificationType } from '../../../domain/entities/Notification';

export const NotificationResponseDTOSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  message: z.string(),
  data: z.record(z.string(), z.unknown()).nullable(),
  isRead: z.boolean(),
  readAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export type NotificationResponseDTO = z.infer<typeof NotificationResponseDTOSchema>;