import { z } from 'zod'
import { NotificationType } from '../../../domain/entities/Notification'

export const CreateNotificationShema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    type: z.nativeEnum(NotificationType),
    title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters').trim(),
    message: z.string().min(1, 'Message is required').max(2000, 'Message must not exceed 2000 characters').trim(),
    data: z.record(z.string(), z.unknown()).optional()
})

export type CreateNotificationDTO = z.infer<typeof CreateNotificationShema>;
