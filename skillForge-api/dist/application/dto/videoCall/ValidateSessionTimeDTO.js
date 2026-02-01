"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSessionTimeResponseSchema = void 0;
const zod_1 = require("zod");
exports.ValidateSessionTimeResponseSchema = zod_1.z.object({
    canJoin: zod_1.z.boolean(),
    message: zod_1.z.string(),
    sessionStartAt: zod_1.z.date(),
    sessionEndAt: zod_1.z.date(),
    remainingSeconds: zod_1.z.number(),
    sessionDurationMinutes: zod_1.z.number(),
});
//# sourceMappingURL=ValidateSessionTimeDTO.js.map