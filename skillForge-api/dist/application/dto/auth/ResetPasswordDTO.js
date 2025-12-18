"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.ResetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please provide a valid email address'),
    otpCode: zod_1.z.string().length(6, 'OTP code must be 6 digits'),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
//# sourceMappingURL=ResetPasswordDTO.js.map