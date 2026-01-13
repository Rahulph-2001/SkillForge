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
exports.CommunityMapper = void 0;
// skillForge-api/src/application/mappers/CommunityMapper.ts
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
let CommunityMapper = class CommunityMapper {
    constructor(communityRepository, userRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }
    async toDTO(community, userId) {
        let adminName = undefined;
        let adminAvatar = undefined;
        try {
            const adminUser = await this.userRepository.findById(community.adminId);
            if (adminUser) {
                adminName = adminUser.name;
                adminAvatar = adminUser.avatarUrl;
            }
        }
        catch (error) {
            console.error('[CommunityMapper] Failed to fetch admin user:', error);
        }
        return {
            id: community.id,
            name: community.name,
            description: community.description,
            category: community.category,
            imageUrl: community.imageUrl,
            videoUrl: community.videoUrl,
            adminId: community.adminId,
            adminName: adminName,
            adminAvatar: adminAvatar,
            creditsCost: community.creditsCost,
            creditsPeriod: community.creditsPeriod,
            membersCount: community.membersCount,
            isActive: community.isActive,
            createdAt: community.createdAt,
            updatedAt: community.updatedAt,
            isAdmin: (userId && community.adminId === userId) || community.isAdmin || false,
            isJoined: community.isJoined || false,
        };
    }
    async toDTOList(communities, userId) {
        const dtos = await Promise.all(communities.map(community => this.toDTO(community, userId)));
        return dtos;
    }
};
exports.CommunityMapper = CommunityMapper;
exports.CommunityMapper = CommunityMapper = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CommunityMapper);
//# sourceMappingURL=CommunityMapper.js.map