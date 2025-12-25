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
exports.VerifyOtpUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const User_1 = require("../../../domain/entities/User");
const Email_1 = require("../../../shared/value-objects/Email");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let VerifyOtpUseCase = class VerifyOtpUseCase {
    constructor(userRepository, otpRepository, emailService, jwtService, pendingRegistrationService, userDTOMapper) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.pendingRegistrationService = pendingRegistrationService;
        this.userDTOMapper = userDTOMapper;
    }
    async execute(request) {
        const { email: rawEmail, otpCode } = request;
        // Check if this is a new registration (pending) or existing unverified user
        let user = await this.userRepository.findByEmail(rawEmail);
        const pendingRegistration = await this.pendingRegistrationService.getPendingRegistration(rawEmail);
        if (!user && !pendingRegistration) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
        }
        if (user && user.verification.email_verified) {
            throw new AppError_1.ConflictError(messages_1.ERROR_MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
        }
        const otpToken = await this.otpRepository.findByCode(otpCode, rawEmail);
        if (!otpToken) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        if (otpToken.otpCode !== otpCode) {
            try {
                otpToken.incrementAttempts();
                await this.otpRepository.update(otpToken);
            }
            catch (e) {
                throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.AUTH.OTP_MAX_ATTEMPTS);
            }
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        if (!otpToken.isValid()) {
            await this.otpRepository.deleteExpiredTokens();
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.AUTH.OTP_INVALID);
        }
        // Mark OTP as verified
        otpToken.verify();
        await this.otpRepository.update(otpToken);
        // CRITICAL: Create user from pending registration if this is first-time verification
        if (pendingRegistration) {
            const newUser = new User_1.User({
                name: pendingRegistration.fullName,
                email: new Email_1.Email(pendingRegistration.email),
                password: pendingRegistration.passwordHash,
                role: 'user',
                bonus_credits: pendingRegistration.bonusCredits,
                registration_ip: pendingRegistration.registrationIp,
                avatarUrl: pendingRegistration.avatarUrl,
            });
            // Mark email as verified immediately
            newUser.verifyEmail();
            // Save user to database ONLY after OTP verification
            user = await this.userRepository.save(newUser);
            // Clean up pending registration
            await this.pendingRegistrationService.deletePendingRegistration(rawEmail);
        }
        else if (user) {
            // Existing user verification
            user.verifyEmail();
            await this.userRepository.update(user);
        }
        // Safety check - should never happen due to earlier validation
        if (!user) {
            throw new Error('User creation or retrieval failed during OTP verification');
        }
        try {
            await this.emailService.sendWelcomeEmail(user.email.value, user.name);
        }
        catch (error) {
            console.warn('Welcome email failed to send:', error);
        }
        const tokenPayload = {
            userId: user.id,
            email: user.email.value,
            role: user.role,
        };
        const refreshTokenPayload = {
            userId: user.id,
            email: user.email.value,
        };
        const token = this.jwtService.generateToken(tokenPayload);
        const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);
        return {
            user: await this.userDTOMapper.toUserResponseDTO(user),
            token,
            refreshToken,
            message: messages_1.SUCCESS_MESSAGES.AUTH.VERIFY_OTP_SUCCESS
        };
    }
};
exports.VerifyOtpUseCase = VerifyOtpUseCase;
exports.VerifyOtpUseCase = VerifyOtpUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IEmailService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IJWTService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IPendingRegistrationService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IUserDTOMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], VerifyOtpUseCase);
//# sourceMappingURL=VerifyOtpUseCase.js.map