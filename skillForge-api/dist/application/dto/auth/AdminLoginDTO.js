"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginSchema = void 0;
const zod_1 = require("zod");
exports.AdminLoginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' })
        .toLowerCase(),
    password: zod_1.z.string()
        .min(8, { message: 'Password must be at least 8 characters' }),
});
//# sourceMappingURL=AdminLoginDTO.js.map