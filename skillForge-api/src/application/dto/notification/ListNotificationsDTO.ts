import { z } from 'zod';
import { NotificationResponseDTOSchema } from './NotificationResponseDTO';

export const ListNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isRead: z.enum(['true', 'false']).optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
});

export type ListNotificationsQueryDTO = z.infer<typeof ListNotificationsQuerySchema>;

export const ListNotificationsResponseSchema = z.object({
  notifications: z.array(NotificationResponseDTOSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  unreadCount: z.number(),
});

export type ListNotificationsResponseDTO = z.infer<typeof ListNotificationsResponseSchema>;