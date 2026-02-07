"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationResponseDTOSchema = void 0;
const zod_1 = require("zod");
const Notification_1 = require("../../../domain/entities/Notification");
exports.NotificationResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(Notification_1.NotificationType),
    title: zod_1.z.string(),
    message: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).nullable(),
    isRead: zod_1.z.boolean(),
    readAt: zod_1.z.coerce.date().nullable(),
    createdAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=NotificationResponseDTO.js.map