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
exports.ResendOtpUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const OTPToken_1 = require("../../../domain/entities/OTPToken");
const env_1 = require("../../../config/env");
const messages_1 = require("../../../config/messages");
let ResendOtpUseCase = class ResendOtpUseCase {
    constructor(userRepository, otpRepository, otpService, emailService, pendingRegistrationService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.pendingRegistrationService = pendingRegistrationService;
    }
    async execute(request, ipAddress) {
        const { email: rawEmail } = request;
        // Normalize email to lowercase for consistent lookup
        const normalizedEmail = rawEmail.toLowerCase().trim();
        // INDUSTRIAL LEVEL: Check BOTH pending registrations (Redis) AND database
        // 1. First check if this is a pending registration (user hasn't verified OTP yet)
        const pendingRegistration = await this.pendingRegistrationService.getPendingRegistration(normalizedEmail);
        if (pendingRegistration) {
            // Generate new OTP for pending registration
            const tempUserId = `temp_${Date.now()}_${normalizedEmail}`;
            const otpCode = this.otpService.generateOTP();
            const otp = new OTPToken_1.OTPToken({
                userId: tempUserId,
                otpType: 'email',
                contactInfo: normalizedEmail,
                otpCode: otpCode,
                ipAddress: ipAddress,
                expiresInMinutes: env_1.env.OTP_EXPIRY_MINUTES,
            });
            // Save OTP to repository
            await this.otpRepository.save(otp);
            // Send OTP email
            try {
                await this.emailService.sendOTPEmail(normalizedEmail, otpCode, pendingRegistration.fullName);
            }
            catch (error) {
                console.error('Failed to send OTP email:', error);
                throw new AppError_1.InternalServerError(messages_1.ERROR_MESSAGES.GENERAL.EMAIL_SEND_FAILED);
            }
            return {
                success: true,
                message: messages_1.SUCCESS_MESSAGES.AUTH.RESEND_OTP_SUCCESS,
                expiresAt: otp.expiresAt,
            };
        }
        // 2. If not in pending registrations, check database for existing unverified user
        const user = await this.userRepository.findByEmail(normalizedEmail);
        if (!user) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
        }
        // Check if user is already verified
        if (user.verification.email_verified) {
            throw new AppError_1.ConflictError(messages_1.ERROR_MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
        }
        // Delete existing OTP tokens for this user
        const existingOtp = await this.otpRepository.findByUserIdAndType(user.id, 'email');
        if (existingOtp) {
            await this.otpRepository.deleteExpiredTokens();
        }
        // Generate new OTP code
        const otpCode = this.otpService.generateOTP();
        const otp = new OTPToken_1.OTPToken({
            userId: user.id,
            otpType: 'email',
            contactInfo: user.email.value,
            otpCode: otpCode,
            ipAddress: ipAddress,
            expiresInMinutes: env_1.env.OTP_EXPIRY_MINUTES,
        });
        // Save OTP to repository
        await this.otpRepository.save(otp);
        // Send OTP email
        try {
            await this.emailService.sendOTPEmail(user.email.value, otpCode, user.name);
        }
        catch (error) {
            console.error('Failed to send OTP email:', error);
            throw new AppError_1.InternalServerError(messages_1.ERROR_MESSAGES.GENERAL.EMAIL_SEND_FAILED);
        }
        return {
            success: true,
            message: messages_1.SUCCESS_MESSAGES.AUTH.RESEND_OTP_SUCCESS,
            expiresAt: otp.expiresAt,
        };
    }
};
exports.ResendOtpUseCase = ResendOtpUseCase;
exports.ResendOtpUseCase = ResendOtpUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IEmailService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IPendingRegistrationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ResendOtpUseCase);
//# sourceMappingURL=ResendOtpUseCase.js.map