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
exports.GetUserProfileUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetUserProfileUseCase = class GetUserProfileUseCase {
    constructor(userRepository, skillRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        // Count skills offered by this user
        const skills = await this.skillRepository.findByProviderId(userId);
        const skillsOffered = skills.filter(s => s.status === 'approved' &&
            s.verificationStatus === 'passed' &&
            !s.isBlocked &&
            !s.isAdminBlocked).length;
        return {
            id: user.id,
            name: user.name,
            email: user.email.value,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            location: user.location,
            credits: user.credits,
            walletBalance: Number(user.walletBalance),
            skillsOffered,
            rating: user.rating ? Number(user.rating) : 0,
            reviewCount: user.reviewCount,
            totalSessionsCompleted: user.totalSessionsCompleted,
            memberSince: user.memberSince ? user.memberSince.toISOString() : new Date().toISOString(),
            subscriptionPlan: user.subscriptionPlan || '',
            subscriptionValidUntil: user.subscriptionValidUntil?.toISOString() || null,
        };
    }
};
exports.GetUserProfileUseCase = GetUserProfileUseCase;
exports.GetUserProfileUseCase = GetUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetUserProfileUseCase);
//# sourceMappingURL=GetUserProfileUseCase.js.map