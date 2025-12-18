"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    fullName: zod_1.z.string()
        .min(2, { message: 'Full name must be at least 2 characters long' })
        .max(100, { message: 'Full name must not exceed 100 characters' })
        .regex(/^[a-zA-Z\s]+$/, { message: 'Full name can only contain letters and spaces' }),
    email: zod_1.z.string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' })
        .toLowerCase(),
    password: zod_1.z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: zod_1.z.string()
        .min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
//# sourceMappingURL=RegisterDTO.js.map