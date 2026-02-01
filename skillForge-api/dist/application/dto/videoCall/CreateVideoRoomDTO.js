"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVideoRoomSchema = void 0;
const zod_1 = require("zod");
exports.CreateVideoRoomSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid('Invalid booking ID').optional(),
    interviewId: zod_1.z.string().uuid('Invalid interview ID').optional(),
});
//# sourceMappingURL=CreateVideoRoomDTO.js.map