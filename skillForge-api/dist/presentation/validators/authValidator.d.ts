import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare const registerSchema: import("zod").ZodObject<{
    fullName: import("zod").ZodString;
    email: import("zod").ZodString;
    password: import("zod").ZodString;
    confirmPassword: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
export declare const loginSchema: import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
export declare const verifyOtpSchema: import("zod").ZodObject<{
    email: import("zod").ZodString;
    otpCode: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
export declare const resendOtpSchema: import("zod").ZodObject<{
    email: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
export declare const adminLoginSchema: import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>;
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authValidator.d.ts.map