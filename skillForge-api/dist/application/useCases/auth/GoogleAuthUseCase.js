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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const User_1 = require("../../../domain/entities/User");
const Email_1 = require("../../../shared/value-objects/Email");
const env_1 = require("../../../config/env");
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = require("../../../domain/errors/AppError");
let GoogleAuthUseCase = class GoogleAuthUseCase {
    constructor(userRepository, jwtService, userDTOMapper) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.userDTOMapper = userDTOMapper;
    }
    async execute(googleProfile) {
        const googleEmail = googleProfile.emails?.[0]?.value;
        if (!googleEmail) {
            throw new AppError_1.ValidationError('Google profile is missing an email address.');
        }
        const fullName = this.extractFullName(googleProfile);
        const avatarUrl = googleProfile.photos?.[0]?.value;
        // Check for existing user
        let user = await this.userRepository.findByEmail(googleEmail);
        let isNewUser = false;
        if (!user) {
            // CRITICAL: New user from Google - create with verified email and free credits
            isNewUser = true;
            const newUser = new User_1.User({
                name: fullName,
                email: new Email_1.Email(googleEmail),
                password: this.generateSecurePasswordHash(), // Secure random password for OAuth users
                role: 'user',
                bonusCredits: env_1.env.DEFAULT_BONUS_CREDITS, // Ensure free credits are given
                registrationIp: 'Google OAuth',
                avatarUrl: avatarUrl,
            });
            // Mark email as verified since Google verified it
            newUser.verifyEmail();
            // Save new user
            user = await this.userRepository.save(newUser);
        }
        else {
            // Existing user - update avatar if changed and update login time
            if (avatarUrl && user.avatarUrl !== avatarUrl) {
                user.updateAvatar(avatarUrl);
            }
            // If user exists but email not verified (edge case), verify it
            if (!user.verification.email_verified) {
                user.verifyEmail();
            }
        }
        // Update last login for both new and existing users
        user.updateLastLogin('Google OAuth');
        await this.userRepository.update(user);
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
            isNewUser,
        };
    }
    extractFullName(profile) {
        if (profile.displayName) {
            return profile.displayName;
        }
        if (profile.name) {
            const parts = [];
            if (profile.name.givenName)
                parts.push(profile.name.givenName);
            if (profile.name.familyName)
                parts.push(profile.name.familyName);
            if (parts.length > 0) {
                return parts.join(' ');
            }
        }
        if (profile.emails?.[0]?.value) {
            return profile.emails[0].value.split('@')[0];
        }
        return 'Google User';
    }
    generateSecurePasswordHash() {
        const randomBytes = crypto_1.default.randomBytes(32).toString('hex');
        return `OAUTH_GOOGLE_${randomBytes}_${Date.now()}`;
    }
};
exports.GoogleAuthUseCase = GoogleAuthUseCase;
exports.GoogleAuthUseCase = GoogleAuthUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IJWTService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserDTOMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GoogleAuthUseCase);
//# sourceMappingURL=GoogleAuthUseCase.js.map