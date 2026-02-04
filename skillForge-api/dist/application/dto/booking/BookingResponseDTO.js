"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingResponseDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Reschedule Info
 */
const RescheduleInfoSchema = zod_1.z.object({
    newDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    newTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
    reason: zod_1.z.string().min(1, 'Reason is required'),
    requestedBy: zod_1.z.enum(['learner', 'provider']),
    requestedAt: zod_1.z.coerce.date(),
}).nullable();
/**
 * Zod schema for Booking Response DTO
 */
exports.BookingResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid booking ID'),
    skillId: zod_1.z.string().uuid('Invalid skill ID'),
    skillTitle: zod_1.z.string().optional(),
    providerId: zod_1.z.string().uuid('Invalid provider ID'),
    providerName: zod_1.z.string().optional(),
    providerAvatar: zod_1.z.string().url('Invalid avatar URL').nullable().optional(),
    learnerId: zod_1.z.string().uuid('Invalid learner ID'),
    learnerName: zod_1.z.string().optional(),
    learnerAvatar: zod_1.z.string().url('Invalid avatar URL').nullable().optional(),
    preferredDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    preferredTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
    duration: zod_1.z.number().int().min(1).optional(),
    message: zod_1.z.string().nullable(),
    status: zod_1.z.string().min(1, 'Status is required'),
    sessionCost: zod_1.z.number().min(0, 'Session cost must be non-negative'),
    rescheduleInfo: RescheduleInfoSchema.optional(),
    rejectionReason: zod_1.z.string().optional(),
    isReviewed: zod_1.z.boolean().optional(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=BookingResponseDTO.js.map