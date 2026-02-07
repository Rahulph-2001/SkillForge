"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationShema = void 0;
const zod_1 = require("zod");
const Notification_1 = require("../../../domain/entities/Notification");
exports.CreateNotificationShema = zod_1.z.object({
    userId: zod_1.z.string().uuid("Invalid user ID"),
    type: zod_1.z.nativeEnum(Notification_1.NotificationType),
    title: zod_1.z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters').trim(),
    message: zod_1.z.string().min(1, 'Message is required').max(2000, 'Message must not exceed 2000 characters').trim(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional()
});
//# sourceMappingURL=CreateNotificationDTO.js.map