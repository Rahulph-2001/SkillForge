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
exports.GetCommunitiesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetCommunitiesUseCase = class GetCommunitiesUseCase {
    constructor(communityRepository, paginationService) {
        this.communityRepository = communityRepository;
        this.paginationService = paginationService;
    }
    async execute(filters, userId, page = 1, limit = 12) {
        const paginationParams = this.paginationService.createParams(page, limit);
        const { communities, total } = await this.communityRepository.findAllWithPagination({
            category: filters?.category,
            search: filters?.search,
            isActive: true
        }, {
            skip: paginationParams.skip,
            take: paginationParams.take
        });
        let processedCommunities = communities;
        if (userId) {
            const memberships = await this.communityRepository.findMembershipsByUserId(userId);
            const joinedCommunityIds = new Set(memberships.map(m => m.communityId));
            processedCommunities = communities.map(community => {
                const isJoined = joinedCommunityIds.has(community.id);
                const isAdmin = community.adminId === userId;
                community.setIsJoined(isJoined);
                community.setIsAdmin(isAdmin);
                return community;
            });
        }
        return this.paginationService.createResult(processedCommunities, total, paginationParams.page, paginationParams.limit);
    }
};
exports.GetCommunitiesUseCase = GetCommunitiesUseCase;
exports.GetCommunitiesUseCase = GetCommunitiesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object])
], GetCommunitiesUseCase);
//# sourceMappingURL=GetCommunitiesUseCase.js.map