"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinVideoRoomSchema = void 0;
const zod_1 = require("zod");
exports.JoinVideoRoomSchema = zod_1.z
    .object({
    roomId: zod_1.z.string().uuid().optional(),
    roomCode: zod_1.z.string().min(7).max(10).optional(),
    bookingId: zod_1.z.string().uuid().optional(),
})
    .refine((data) => data.roomId || data.roomCode || data.bookingId, {
    message: 'One of roomId, roomCode, or bookingId is required',
});
//# sourceMappingURL=JoinVideoRoomDTO.js.map