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
exports.RegisterUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Email_1 = require("../../../shared/value-objects/Email");
const Password_1 = require("../../../shared/value-objects/Password");
const OTPToken_1 = require("../../../domain/entities/OTPToken");
const AppError_1 = require("../../../domain/errors/AppError");
const env_1 = require("../../../config/env");
const messages_1 = require("../../../config/messages");
let RegisterUseCase = class RegisterUseCase {
    constructor(userRepository, otpRepository, passwordService, otpService, emailService, pendingRegistrationService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordService = passwordService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.pendingRegistrationService = pendingRegistrationService;
    }
    async execute(request, registrationIp) {
        const { fullName, email: rawEmail, password } = request;
        try {
            new Email_1.Email(rawEmail);
            new Password_1.Password(password);
        }
        catch (error) {
            throw new AppError_1.ValidationError(error.message);
        }
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(rawEmail);
        if (existingUser && existingUser.verification.email_verified) {
            throw new AppError_1.ConflictError(messages_1.ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS || 'User with this email already exists');
        }
        // Hash password
        const passwordHash = await this.passwordService.hash(password);
        // CRITICAL: Store pending registration in Redis (NOT in database)
        // User will only be created AFTER OTP verification
        await this.pendingRegistrationService.storePendingRegistration(rawEmail, {
            fullName,
            email: rawEmail,
            passwordHash,
            registrationIp,
            bonusCredits: env_1.env.DEFAULT_BONUS_CREDITS,
        });
        // Generate and save OTP with temporary userId
        const tempUserId = `temp_${Date.now()}_${rawEmail}`;
        const otpCode = this.otpService.generateOTP();
        const otp = new OTPToken_1.OTPToken({
            userId: tempUserId,
            otpType: 'email',
            contactInfo: rawEmail,
            otpCode: otpCode,
            ipAddress: registrationIp,
            expiresInMinutes: env_1.env.OTP_EXPIRY_MINUTES,
        });
        await this.otpRepository.save(otp);
        // Send OTP email
        try {
            await this.emailService.sendOTPEmail(rawEmail, otpCode, fullName);
        }
        catch (error) {
            console.error('Failed to send OTP email:', error);
            // Clean up pending registration if email fails
            await this.pendingRegistrationService.deletePendingRegistration(rawEmail);
            throw error;
        }
        return {
            email: rawEmail,
            expiresAt: otp.expiresAt.toISOString(),
            message: messages_1.SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
        };
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPasswordService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IEmailService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IPendingRegistrationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], RegisterUseCase);
//# sourceMappingURL=RegisterUseCase.js.map