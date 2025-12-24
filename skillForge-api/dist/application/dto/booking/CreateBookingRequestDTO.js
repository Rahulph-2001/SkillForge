"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingRequestSchema = void 0;
const zod_1 = require("zod");
exports.CreateBookingRequestSchema = zod_1.z.object({
    learnerId: zod_1.z.string().uuid('Invalid learner ID'),
    skillId: zod_1.z.string().uuid('Invalid skill ID'),
    providerId: zod_1.z.string().uuid('Invalid provider ID'),
    preferredDate: zod_1.z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    preferredTime: zod_1.z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24-hour)'),
    message: zod_1.z.string()
        .max(500, 'Message must not exceed 500 characters')
        .trim()
        .optional(),
});
//# sourceMappingURL=CreateBookingRequestDTO.js.map