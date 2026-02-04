"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AuthController_1 = require("../../controllers/auth/AuthController");
const authValidator_1 = require("../../validators/authValidator");
const rateLimitMiddleware_1 = require("../../middlewares/rateLimitMiddleware");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const RegisterDTO_1 = require("../../../application/dto/auth/RegisterDTO");
const LoginDTO_1 = require("../../../application/dto/auth/LoginDTO");
const VerifyOtpDTO_1 = require("../../../application/dto/auth/VerifyOtpDTO");
const ResendOtpDTO_1 = require("../../../application/dto/auth/ResendOtpDTO");
const AdminLoginDTO_1 = require("../../../application/dto/auth/AdminLoginDTO");
const ForgotPasswordDTO_1 = require("../../../application/dto/auth/ForgotPasswordDTO");
const VerifyForgotPasswordOtpDTO_1 = require("../../../application/dto/auth/VerifyForgotPasswordOtpDTO");
const ResetPasswordDTO_1 = require("../../../application/dto/auth/ResetPasswordDTO");
const env_1 = require("../../../config/env");
const routes_1 = require("../../../config/routes");
let AuthRoutes = class AuthRoutes {
    constructor(authController) {
        this.authController = authController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Passport is initialized at app level, no need to initialize here again
        // POST /api/v1/auth/register
        this.router.post(routes_1.ENDPOINTS.AUTH.REGISTER, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(RegisterDTO_1.RegisterSchema), this.authController.register.bind(this.authController));
        // POST /api/v1/auth/login
        this.router.post(routes_1.ENDPOINTS.AUTH.LOGIN, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(LoginDTO_1.LoginSchema), this.authController.login.bind(this.authController));
        // POST /api/v1/auth/verify-otp
        this.router.post(routes_1.ENDPOINTS.AUTH.VERIFY_OTP, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(VerifyOtpDTO_1.VerifyOtpSchema), this.authController.verifyOtp.bind(this.authController));
        // POST /api/v1/auth/resend-otp
        this.router.post(routes_1.ENDPOINTS.AUTH.RESEND_OTP, rateLimitMiddleware_1.otpLimiter, (0, authValidator_1.validate)(ResendOtpDTO_1.ResendOtpSchema), this.authController.resendOtp.bind(this.authController));
        // GET /api/v1/auth/me (requires authentication)
        this.router.get(routes_1.ENDPOINTS.AUTH.ME, authMiddleware_1.authMiddleware, this.authController.getMe.bind(this.authController));
        // POST /api/v1/auth/logout
        this.router.post(routes_1.ENDPOINTS.AUTH.LOGOUT, this.authController.logout.bind(this.authController));
        // POST /api/v1/auth/admin/login
        this.router.post(routes_1.ENDPOINTS.AUTH.ADMIN_LOGIN, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(AdminLoginDTO_1.AdminLoginSchema), this.authController.adminLogin.bind(this.authController));
        // GET /api/v1/auth/google
        this.router.get(routes_1.ENDPOINTS.AUTH.GOOGLE, this.authController.googleLogin);
        // GET /api/v1/auth/google/callback
        this.router.get(routes_1.ENDPOINTS.AUTH.GOOGLE_CALLBACK, this.authController.passportService.authenticateGoogleCallback({
            failureRedirect: `${env_1.env.FRONTEND_URL}/login?error=google_auth_failed`
        }), (req, res, next) => this.authController.googleCallback(req, res, next));
        // POST /api/v1/auth/forgot-password
        this.router.post(routes_1.ENDPOINTS.AUTH.FORGOT_PASSWORD, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(ForgotPasswordDTO_1.ForgotPasswordSchema), this.authController.forgotPassword.bind(this.authController));
        // POST /api/v1/auth/verify-forgot-password-otp
        this.router.post(routes_1.ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(VerifyForgotPasswordOtpDTO_1.VerifyForgotPasswordOtpSchema), this.authController.verifyForgotPasswordOtp.bind(this.authController));
        // POST /api/v1/auth/reset-password
        this.router.post(routes_1.ENDPOINTS.AUTH.RESET_PASSWORD, rateLimitMiddleware_1.authLimiter, (0, authValidator_1.validate)(ResetPasswordDTO_1.ResetPasswordSchema), this.authController.resetPassword.bind(this.authController));
        // GET /api/v1/auth/validate-status (requires authentication)
        this.router.get(routes_1.ENDPOINTS.AUTH.VALIDATE_STATUS, authMiddleware_1.authMiddleware, this.authController.validateUserStatus.bind(this.authController));
    }
};
exports.AuthRoutes = AuthRoutes;
exports.AuthRoutes = AuthRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AuthController)),
    __metadata("design:paramtypes", [AuthController_1.AuthController])
], AuthRoutes);
//# sourceMappingURL=authRoutes.js.map