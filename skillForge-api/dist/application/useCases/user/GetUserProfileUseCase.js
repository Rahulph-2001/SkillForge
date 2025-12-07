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
const Database_1 = require("../../../infrastructure/database/Database");
let GetUserProfileUseCase = class GetUserProfileUseCase {
    constructor(database) {
        this.prisma = database.getClient();
    }
    async execute(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                bio: true,
                location: true,
                credits: true,
                walletBalance: true,
                rating: true,
                reviewCount: true,
                totalSessionsCompleted: true,
                memberSince: true,
                subscriptionPlan: true,
                subscriptionValidUntil: true,
            },
        });
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        // Count skills offered by this user
        const skillsOffered = await this.prisma.skill.count({
            where: {
                providerId: userId,
                status: 'approved',
                verificationStatus: 'passed',
                isBlocked: false,
                isDeleted: false,
            },
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            location: user.location,
            credits: user.credits,
            walletBalance: Number(user.walletBalance),
            skillsOffered,
            rating: user.rating ? Number(user.rating) : 0,
            reviewCount: user.reviewCount,
            totalSessionsCompleted: user.totalSessionsCompleted,
            memberSince: user.memberSince.toISOString(),
            subscriptionPlan: user.subscriptionPlan,
            subscriptionValidUntil: user.subscriptionValidUntil?.toISOString() || null,
        };
    }
};
exports.GetUserProfileUseCase = GetUserProfileUseCase;
exports.GetUserProfileUseCase = GetUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], GetUserProfileUseCase);
//# sourceMappingURL=GetUserProfileUseCase.js.map