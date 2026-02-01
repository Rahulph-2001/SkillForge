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
exports.GetCommunityMessagesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetCommunityMessagesUseCase = class GetCommunityMessagesUseCase {
    constructor(messageRepository, communityRepository) {
        this.messageRepository = messageRepository;
        this.communityRepository = communityRepository;
    }
    async execute(userId, communityId, limit = 50, offset = 0) {
        // First, allow community admins to fetch messages even if not in members table
        const community = await this.communityRepository.findById(communityId);
        if (!community) {
            throw new AppError_1.ForbiddenError('Community not found');
        }
        if (community.adminId !== userId) {
            // Check active membership
            const member = await this.communityRepository.findMemberByUserAndCommunity(userId, communityId);
            if (!member || !member.isActive) {
                throw new AppError_1.ForbiddenError('You are not a member of this community');
            }
        }
        return await this.messageRepository.findByCommunityId(communityId, limit, offset);
    }
};
exports.GetCommunityMessagesUseCase = GetCommunityMessagesUseCase;
exports.GetCommunityMessagesUseCase = GetCommunityMessagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetCommunityMessagesUseCase);
//# sourceMappingURL=GetCommunityMessagesUseCase.js.map