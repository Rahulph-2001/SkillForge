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
exports.ResetPasswordUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let ResetPasswordUseCase = class ResetPasswordUseCase {
    constructor(userRepository, otpRepository, passwordService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordService = passwordService;
    }
    async execute(request) {
        const { email: rawEmail, otpCode, newPassword } = request;
        const email = rawEmail.toLowerCase().trim();
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
        }
        // Find and verify OTP
        const otp = await this.otpRepository.findByCode(otpCode, email);
        if (!otp) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // Verify OTP belongs to this user and is for password reset
        if (otp.userId !== user.id || otp.otpType !== 'password_reset') {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // Check if OTP is verified
        if (!otp.isVerified) {
            throw new AppError_1.UnauthorizedError('Please verify OTP first before resetting password');
        }
        // Check if OTP is expired
        if (otp.isExpired()) {
            throw new AppError_1.UnauthorizedError('OTP has expired. Please request a new password reset.');
        }
        // Hash new password
        const passwordHash = await this.passwordService.hash(newPassword);
        // Update user password using the proper method
        user.updatePassword(passwordHash);
        await this.userRepository.update(user);
        // Delete the used OTP immediately after password reset for security
        // This prevents the same OTP from being used again
        try {
            await this.otpRepository.deleteById(otp.id);
        }
        catch (error) {
            console.error('Error deleting OTP after password reset:', error);
            // Continue even if deletion fails - password has been reset successfully
        }
        // Also clean up any other expired tokens
        await this.otpRepository.deleteExpiredTokens();
        return {
            success: true,
            message: messages_1.SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS || 'Password reset successfully',
        };
    }
};
exports.ResetPasswordUseCase = ResetPasswordUseCase;
exports.ResetPasswordUseCase = ResetPasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPasswordService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ResetPasswordUseCase);
//# sourceMappingURL=ResetPasswordUseCase.js.map