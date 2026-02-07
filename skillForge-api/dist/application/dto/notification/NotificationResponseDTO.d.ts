import { z } from 'zod';
import { NotificationType } from '../../../domain/entities/Notification';
export declare const NotificationResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<typeof NotificationType>;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    isRead: z.ZodBoolean;
    readAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type NotificationResponseDTO = z.infer<typeof NotificationResponseDTOSchema>;
//# sourceMappingURL=NotificationResponseDTO.d.ts.map