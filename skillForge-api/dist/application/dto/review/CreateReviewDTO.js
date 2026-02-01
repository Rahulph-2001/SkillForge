"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResponseDTOSchema = exports.CreateReviewSchema = void 0;
const zod_1 = require("zod");
exports.CreateReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    review: zod_1.z.string().min(10, 'Review must be at least 10 characters').max(2000),
});
exports.ReviewResponseDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    bookingId: zod_1.z.string().uuid(),
    providerId: zod_1.z.string().uuid(),
    learnerId: zod_1.z.string().uuid(),
    skillId: zod_1.z.string().uuid(),
    rating: zod_1.z.number(),
    review: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
});
//# sourceMappingURL=CreateReviewDTO.js.map