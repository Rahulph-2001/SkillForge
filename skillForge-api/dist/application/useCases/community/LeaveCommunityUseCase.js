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
exports.LeaveCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Database_1 = require("../../../infrastructure/database/Database");
const AppError_1 = require("../../../domain/errors/AppError");
let LeaveCommunityUseCase = class LeaveCommunityUseCase {
    constructor(communityRepository, webSocketService, database) {
        this.communityRepository = communityRepository;
        this.webSocketService = webSocketService;
        this.database = database;
    }
    async execute(userId, communityId) {
        const community = await this.communityRepository.findById(communityId);
        if (!community) {
            throw new AppError_1.NotFoundError('Community not found');
        }
        if (community.adminId === userId) {
            throw new AppError_1.ForbiddenError('Community admin cannot leave the community');
        }
        const member = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
        if (!member) {
            throw new AppError_1.NotFoundError('Not a member of this community');
        }
        // Use transaction for atomic update
        await this.database.transaction(async (tx) => {
            // Update member status
            await tx.communityMember.updateMany({
                where: { userId, communityId, isActive: true },
                data: {
                    isActive: false,
                    leftAt: new Date(),
                },
            });
            // Decrement member count
            await tx.community.update({
                where: { id: communityId },
                data: {
                    membersCount: { decrement: 1 },
                    updatedAt: new Date(),
                },
            });
        });
        // Broadcast WebSocket event
        setImmediate(() => {
            this.webSocketService.sendToCommunity(communityId, {
                type: 'member_left',
                communityId,
                data: {
                    userId,
                    timestamp: new Date().toISOString(),
                },
            });
        });
    }
};
exports.LeaveCommunityUseCase = LeaveCommunityUseCase;
exports.LeaveCommunityUseCase = LeaveCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Object, Object, Database_1.Database])
], LeaveCommunityUseCase);
//# sourceMappingURL=LeaveCommunityUseCase.js.map