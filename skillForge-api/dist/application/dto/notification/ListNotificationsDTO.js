"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNotificationsResponseSchema = exports.ListNotificationsQuerySchema = void 0;
const zod_1 = require("zod");
const NotificationResponseDTO_1 = require("./NotificationResponseDTO");
exports.ListNotificationsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    isRead: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
});
exports.ListNotificationsResponseSchema = zod_1.z.object({
    notifications: zod_1.z.array(NotificationResponseDTO_1.NotificationResponseDTOSchema),
    total: zod_1.z.number(),
    page: zod_1.z.number(),
    limit: zod_1.z.number(),
    totalPages: zod_1.z.number(),
    unreadCount: zod_1.z.number(),
});
//# sourceMappingURL=ListNotificationsDTO.js.map