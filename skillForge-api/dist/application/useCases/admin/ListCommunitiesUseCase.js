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
exports.ListCommunitiesUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
let ListCommunitiesUseCase = class ListCommunitiesUseCase {
    constructor(userRepository, communityRepository, communityMapper, paginationService) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.communityMapper = communityMapper;
        this.paginationService = paginationService;
    }
    async execute(request) {
        // 1. Verify admin user
        const adminUser = await this.userRepository.findById(request.adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // 2. Create pagination params
        const paginationParams = this.paginationService.createParams(request.page, request.limit);
        // 2. Build filters for repository query
        const filters = {};
        if (request.search) {
            filters.search = request.search;
        }
        if (request.category) {
            filters.category = request.category;
        }
        // Admin can see ALL communities (including blocked ones)
        // Do not filter by isActive - show both active and blocked
        // 3. Fetch communities with paginationed communities
        const { communities, total } = await this.communityRepository.findAllWithPagination(filters, paginationParams);
        // 5. Map communities to DTOs
        const communityDTOs = await this.communityMapper.toDTOList(communities);
        // 6. Calculate statistics (fetch all communities for accurate stats)
        const allCommunities = await this.communityRepository.findAll();
        const totalMembers = allCommunities.reduce((sum, community) => sum + community.membersCount, 0);
        const avgMembershipCost = allCommunities.length > 0
            ? allCommunities.reduce((sum, community) => sum + community.creditsCost, 0) / allCommunities.length
            : 0;
        // 7. Create pagination result
        const paginationResult = this.paginationService.createResult(communityDTOs, total, request.page, request.limit);
        // 8. Return response
        return {
            communities: communityDTOs,
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            },
            stats: {
                totalCommunities: allCommunities.length,
                totalMembers,
                avgMembershipCost: parseFloat(avgMembershipCost.toFixed(1)),
            },
        };
    }
};
exports.ListCommunitiesUseCase = ListCommunitiesUseCase;
exports.ListCommunitiesUseCase = ListCommunitiesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ICommunityMapper)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ListCommunitiesUseCase);
//# sourceMappingURL=ListCommunitiesUseCase.js.map