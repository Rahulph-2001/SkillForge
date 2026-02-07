import { z } from 'zod';
export declare const ListNotificationsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    isRead: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean | undefined, "true" | "false" | undefined>>;
}, z.core.$strip>;
export type ListNotificationsQueryDTO = z.infer<typeof ListNotificationsQuerySchema>;
export declare const ListNotificationsResponseSchema: z.ZodObject<{
    notifications: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<typeof import("../../../domain/entities/Notification").NotificationType>;
        title: z.ZodString;
        message: z.ZodString;
        data: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        isRead: z.ZodBoolean;
        readAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
        createdAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    unreadCount: z.ZodNumber;
}, z.core.$strip>;
export type ListNotificationsResponseDTO = z.infer<typeof ListNotificationsResponseSchema>;
//# sourceMappingURL=ListNotificationsDTO.d.ts.map