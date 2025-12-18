"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.adminLoginSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const RegisterDTO_1 = require("../../application/dto/auth/RegisterDTO");
const LoginDTO_1 = require("../../application/dto/auth/LoginDTO");
const VerifyOtpDTO_1 = require("../../application/dto/auth/VerifyOtpDTO");
const ResendOtpDTO_1 = require("../../application/dto/auth/ResendOtpDTO");
const AdminLoginDTO_1 = require("../../application/dto/auth/AdminLoginDTO");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const AppError_1 = require("../../domain/errors/AppError");
exports.registerSchema = RegisterDTO_1.RegisterSchema;
exports.loginSchema = LoginDTO_1.LoginSchema;
exports.verifyOtpSchema = VerifyOtpDTO_1.VerifyOtpSchema;
exports.resendOtpSchema = ResendOtpDTO_1.ResendOtpSchema;
exports.adminLoginSchema = AdminLoginDTO_1.AdminLoginSchema;
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                req.zodDetails = errors; // For errorHandler
                res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    error: 'Validation failed',
                    details: errors,
                });
                return;
            }
            next(new AppError_1.ValidationError(error.message));
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=authValidator.js.map