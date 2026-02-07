import { z } from 'zod';
import { NotificationType } from '../../../domain/entities/Notification';
export declare const CreateNotificationShema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodEnum<typeof NotificationType>;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateNotificationDTO = z.infer<typeof CreateNotificationShema>;
//# sourceMappingURL=CreateNotificationDTO.d.ts.map