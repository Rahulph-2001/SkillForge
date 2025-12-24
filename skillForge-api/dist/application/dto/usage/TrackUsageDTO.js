"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackUsageSchema = void 0;
const zod_1 = require("zod");
exports.TrackUsageSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string()
        .uuid('Invalid subscription ID'),
    featureKey: zod_1.z.string()
        .min(1, 'Feature key is required')
        .max(100, 'Feature key too long')
        .trim(),
    incrementBy: zod_1.z.number()
        .int('Increment must be an integer')
        .min(1, 'Increment must be at least 1')
        .default(1),
});
//# sourceMappingURL=TrackUsageDTO.js.map