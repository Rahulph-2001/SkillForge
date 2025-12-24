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
exports.JoinCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const CommunityMember_1 = require("../../../domain/entities/CommunityMember");
const AppError_1 = require("../../../domain/errors/AppError");
const client_1 = require("@prisma/client");
let JoinCommunityUseCase = class JoinCommunityUseCase {
    constructor(communityRepository, userRepository, webSocketService, prisma) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
        this.prisma = prisma;
    }
    async execute(userId, communityId) {
        // Use Prisma transaction to ensure atomicity
        return await this.prisma.$transaction(async (tx) => {
            // 1. Find community
            const community = await this.communityRepository.findById(communityId);
            if (!community) {
                throw new AppError_1.NotFoundError('Community not found');
            }
            // 2. Check if already a member
            const existingMember = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
            if (existingMember && existingMember.isActive) {
                throw new AppError_1.ConflictError('Already a member of this community');
            }
            // 3. Find user and verify credits
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new AppError_1.NotFoundError('User not found');
            }
            if (user.credits < community.creditsCost) {
                throw new AppError_1.ValidationError(`Insufficient credits to join community. Required: ${community.creditsCost}, Available: ${user.credits}`);
            }
            // 4. Deduct credits from user
            user.deductCredits(community.creditsCost);
            await tx.user.update({
                where: { id: userId },
                data: {
                    credits: user.credits,
                    updatedAt: new Date(),
                },
            });
            // 5. Calculate subscription end date
            const subscriptionEndsAt = new Date();
            subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30); // Default 30 days
            // 6. Create or reactivate member record (upsert for rejoin support)
            const member = new CommunityMember_1.CommunityMember({
                communityId,
                userId,
                role: 'member',
                subscriptionEndsAt,
            });
            const memberData = member.toJSON();
            await tx.communityMember.upsert({
                where: {
                    communityId_userId: {
                        communityId: communityId,
                        userId: userId,
                    },
                },
                create: {
                    id: memberData.id,
                    communityId: memberData.communityId,
                    userId: memberData.userId,
                    role: memberData.role,
                    isAutoRenew: memberData.isAutoRenew,
                    subscriptionEndsAt: memberData.subscriptionEndsAt,
                    joinedAt: memberData.joinedAt,
                    isActive: true,
                },
                update: {
                    isActive: true,
                    role: 'member',
                    subscriptionEndsAt: memberData.subscriptionEndsAt,
                    joinedAt: new Date(),
                    leftAt: null,
                },
            });
            // 7. Increment member count
            await tx.community.update({
                where: { id: communityId },
                data: {
                    membersCount: { increment: 1 },
                    updatedAt: new Date(),
                },
            });
            // 8. Broadcast WebSocket event (outside transaction - non-critical)
            setImmediate(() => {
                this.webSocketService.sendToCommunity(communityId, {
                    type: 'member_joined',
                    communityId,
                    data: {
                        userId,
                        userName: user.name,
                        timestamp: new Date().toISOString(),
                    },
                });
            });
            return member;
        });
    }
};
exports.JoinCommunityUseCase = JoinCommunityUseCase;
exports.JoinCommunityUseCase = JoinCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [Object, Object, Object, client_1.PrismaClient])
], JoinCommunityUseCase);
//# sourceMappingURL=JoinCommunityUseCase.js.map