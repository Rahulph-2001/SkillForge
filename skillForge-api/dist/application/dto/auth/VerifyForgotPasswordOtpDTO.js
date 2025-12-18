"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyForgotPasswordOtpSchema = void 0;
const zod_1 = require("zod");
exports.VerifyForgotPasswordOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please provide a valid email address'),
    otpCode: zod_1.z.string().length(6, 'OTP code must be 6 digits'),
});
//# sourceMappingURL=VerifyForgotPasswordOtpDTO.js.map