"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpSchema = void 0;
const zod_1 = require("zod");
exports.ResendOtpSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' })
        .toLowerCase(),
});
//# sourceMappingURL=ResendOtpDTO.js.map