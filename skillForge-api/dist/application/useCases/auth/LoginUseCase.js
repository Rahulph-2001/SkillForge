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
exports.LoginUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let LoginUseCase = class LoginUseCase {
    constructor(userRepository, passwordService, jwtService, userDTOMapper) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
        this.userDTOMapper = userDTOMapper;
    }
    async execute(request, ipAddress) {
        const { email: rawEmail, password } = request;
        const user = await this.userRepository.findByEmail(rawEmail);
        if (!user) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        }
        const isMatch = await this.passwordService.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError_1.UnauthorizedError(messages_1.ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
        }
        if (!user.isActive || user.isDeleted) {
            throw new AppError_1.ForbiddenError('Your account has been suspended. Please contact support.');
        }
        user.updateLastLogin(ipAddress || 'unknown');
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
        };
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPasswordService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IJWTService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserDTOMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], LoginUseCase);
//# sourceMappingURL=LoginUseCase.js.map