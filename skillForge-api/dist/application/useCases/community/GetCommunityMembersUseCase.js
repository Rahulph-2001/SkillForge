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
exports.GetCommunityMembersUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetCommunityMembersUseCase = class GetCommunityMembersUseCase {
    constructor(communityRepository, userRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }
    async execute(communityId, limit, offset) {
        const members = await this.communityRepository.findMembersByCommunityId(communityId);
        const paginatedMembers = members.slice(offset, offset + limit);
        // Map members to DTOs (user details are already fetched by repository)
        const membersWithUserDetails = paginatedMembers.map((m) => {
            const json = m.toJSON();
            return {
                id: json.id,
                userId: json.userId,
                communityId: json.communityId,
                role: json.role,
                isAutoRenew: json.isAutoRenew,
                subscriptionEndsAt: json.subscriptionEndsAt,
                joinedAt: json.joinedAt,
                leftAt: json.leftAt,
                isActive: json.isActive,
                userName: json.userName,
                userAvatar: json.userAvatar,
            };
        });
        return {
            members: membersWithUserDetails,
            total: members.length,
            limit,
            offset,
        };
    }
};
exports.GetCommunityMembersUseCase = GetCommunityMembersUseCase;
exports.GetCommunityMembersUseCase = GetCommunityMembersUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetCommunityMembersUseCase);
//# sourceMappingURL=GetCommunityMembersUseCase.js.map