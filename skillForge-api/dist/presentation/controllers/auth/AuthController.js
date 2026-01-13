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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PassportService_1 = require("../../../infrastructure/services/PassportService");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const env_1 = require("../../../config/env");
const messages_1 = require("../../../config/messages");
const getClientIp = (req) => {
    return (req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket.remoteAddress);
};
let AuthController = class AuthController {
    constructor(passportService, registerUseCase, loginUseCase, verifyOtpUseCase, resendOtpUseCase, adminLoginUseCase, googleAuthUseCase, forgotPasswordUseCase, verifyForgotPasswordOtpUseCase, resetPasswordUseCase, getUserByIdUseCase, authResponseMapper) {
        this.passportService = passportService;
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
        this.resendOtpUseCase = resendOtpUseCase;
        this.adminLoginUseCase = adminLoginUseCase;
        this.googleAuthUseCase = googleAuthUseCase;
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.verifyForgotPasswordOtpUseCase = verifyForgotPasswordOtpUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.authResponseMapper = authResponseMapper;
        this.googleLogin = this.passportService.authenticateGoogle();
    }
    async register(req, res, next) {
        try {
            const registrationIp = getClientIp(req);
            const { email, expiresAt, message } = await this.registerUseCase.execute(req.body, registrationIp);
            res
                .status(HttpStatusCode_1.HttpStatusCode.CREATED)
                .json(this.authResponseMapper.mapRegisterResponse(email, expiresAt, message));
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const ipAddress = getClientIp(req);
            const { user, token, refreshToken } = await this.loginUseCase.execute(req.body, ipAddress);
            // Set accessToken cookie (HTTP-only for security)
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            // Set refreshToken cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res
                .status(HttpStatusCode_1.HttpStatusCode.OK)
                .json(this.authResponseMapper.mapLoginResponse(user, token, refreshToken));
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { user, message, token, refreshToken } = await this.verifyOtpUseCase.execute(req.body);
            // Set accessToken cookie (HTTP-only for security)
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            // Set refreshToken cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res
                .status(HttpStatusCode_1.HttpStatusCode.OK)
                .json(this.authResponseMapper.mapVerifyOtpResponse(user, message, token, refreshToken));
        }
        catch (error) {
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        try {
            const ipAddress = getClientIp(req);
            const result = await this.resendOtpUseCase.execute(req.body, ipAddress);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: result.message,
                data: {
                    expiresAt: result.expiresAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            // User token payload is attached to req by auth middleware
            const tokenPayload = req.user;
            if (!tokenPayload || !tokenPayload.userId) {
                res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: 'Not authenticated',
                });
                return;
            }
            // Fetch full user data from database to get name, credits, etc.
            const user = await this.getUserByIdUseCase.execute(tokenPayload.userId);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email.value,
                        role: user.role,
                        credits: user.credits,
                        avatar: user.avatarUrl, // Include avatar URL
                        subscriptionPlan: user.subscriptionPlan,
                        verification: {
                            email_verified: user.verification.email_verified,
                        },
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(_req, res, next) {
        try {
            // Clear both accessToken and refreshToken cookies
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json(this.authResponseMapper.mapLogoutResponse());
        }
        catch (error) {
            next(error);
        }
    }
    async adminLogin(req, res, next) {
        try {
            const ipAddress = getClientIp(req);
            const { user, token, refreshToken } = await this.adminLoginUseCase.execute(req.body, ipAddress);
            // Set accessToken cookie (HTTP-only for security)
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            // Set refreshToken cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res
                .status(HttpStatusCode_1.HttpStatusCode.OK)
                .json(this.authResponseMapper.mapLoginResponse(user, token, refreshToken));
        }
        catch (error) {
            next(error);
        }
    }
    async googleCallback(req, res, next) {
        try {
            const googleProfile = req.user;
            if (!googleProfile) {
                res.redirect(`${env_1.env.FRONTEND_URL}/login?error=google_auth_failed`);
                return;
            }
            const result = await this.googleAuthUseCase.execute(googleProfile);
            // Set accessToken cookie (HTTP-only for security)
            res.cookie('accessToken', result.token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            // Set refreshToken cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Redirect to frontend callback page with isNewUser flag
            const redirectUrl = result.isNewUser
                ? `${env_1.env.FRONTEND_URL}/auth/google/callback?isNewUser=true`
                : `${env_1.env.FRONTEND_URL}/auth/google/callback`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const ipAddress = getClientIp(req);
            const result = await this.forgotPasswordUseCase.execute(req.body, ipAddress);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: result.message,
                data: {
                    expiresAt: result.expiresAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyForgotPasswordOtp(req, res, next) {
        try {
            const result = await this.verifyForgotPasswordOtpUseCase.execute(req.body);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: result.message,
                data: {
                    verified: result.verified,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await this.resetPasswordUseCase.execute(req.body);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async validateUserStatus(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }
            const user = await this.getUserByIdUseCase.execute(userId);
            // Check if user is suspended or deleted
            if (!user.isActive || user.isDeleted) {
                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    error: messages_1.ERROR_MESSAGES.AUTH.ACCOUNT_SUSPENDED,
                    data: {
                        isActive: false,
                    },
                });
                return;
            }
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                data: {
                    isActive: true,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PassportService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IRegisterUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ILoginUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IVerifyOtpUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResendOtpUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IAdminLoginUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IGoogleAuthUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IForgotPasswordUseCase)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.IVerifyForgotPasswordOtpUseCase)),
    __param(9, (0, inversify_1.inject)(types_1.TYPES.IResetPasswordUseCase)),
    __param(10, (0, inversify_1.inject)(types_1.TYPES.IGetUserByIdUseCase)),
    __param(11, (0, inversify_1.inject)(types_1.TYPES.IAuthResponseMapper)),
    __metadata("design:paramtypes", [PassportService_1.PassportService, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
//# sourceMappingURL=AuthController.js.map