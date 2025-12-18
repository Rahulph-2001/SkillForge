"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpSchema = void 0;
const zod_1 = require("zod");
exports.VerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please provide a valid email address').toLowerCase(),
    otpCode: zod_1.z.string().length(6, 'OTP must be 6 digits long').regex(/^\d+$/, 'OTP must be numeric')
});
//# sourceMappingURL=VerifyOtpDTO.js.map