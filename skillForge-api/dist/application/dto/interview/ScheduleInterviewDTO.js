"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewResponseSchema = exports.ScheduleInterviewSchema = void 0;
const zod_1 = require("zod");
exports.ScheduleInterviewSchema = zod_1.z.object({
    applicationId: zod_1.z.string().uuid(),
    scheduledAt: zod_1.z.coerce.date(),
    durationMinutes: zod_1.z.number().min(15).max(180).optional(),
});
exports.InterviewResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    applicationId: zod_1.z.string().uuid(),
    scheduledAt: zod_1.z.coerce.date(),
    durationMinutes: zod_1.z.number(),
    status: zod_1.z.string(),
    meetingLink: zod_1.z.string().nullable(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=ScheduleInterviewDTO.js.map