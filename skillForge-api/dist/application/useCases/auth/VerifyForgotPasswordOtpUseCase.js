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
exports.VerifyForgotPasswordOtpUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let VerifyForgotPasswordOtpUseCase = class VerifyForgotPasswordOtpUseCase {
    constructor(userRepository, otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    async execute(request) {
        const { email: rawEmail, otpCode } = request;
        const email = rawEmail.toLowerCase().trim();
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
        }
        // Find OTP by code and contact info
        const otp = await this.otpRepository.findByCode(otpCode, email);
        if (!otp) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // Verify OTP belongs to this user and is for password reset
        if (otp.userId !== user.id || otp.otpType !== 'password_reset') {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // Check if OTP is expired
        if (otp.isExpired()) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // If OTP is already verified, return success (allow re-verification for better UX)
        // This allows users to navigate back and forth without issues
        if (otp.isVerified) {
            return {
                success: true,
                message: 'OTP already verified. You can proceed to reset your password.',
                verified: true,
            };
        }
        // Check if max attempts exceeded
        if (!otp.isValid()) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_MAX_ATTEMPTS);
        }
        // Verify the OTP
        try {
            if (otp.otpCode !== otpCode) {
                otp.incrementAttempts();
                await this.otpRepository.update(otp);
                throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
            }
            // Mark OTP as verified
            otp.verify();
            await this.otpRepository.update(otp);
            return {
                success: true,
                message: 'OTP verified successfully. You can now reset your password.',
                verified: true,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.UnauthorizedError) {
                throw error;
            }
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
    }
};
exports.VerifyForgotPasswordOtpUseCase = VerifyForgotPasswordOtpUseCase;
exports.VerifyForgotPasswordOtpUseCase = VerifyForgotPasswordOtpUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPRepository)),
    __metadata("design:paramtypes", [Object, Object])
], VerifyForgotPasswordOtpUseCase);
//# sourceMappingURL=VerifyForgotPasswordOtpUseCase.js.map