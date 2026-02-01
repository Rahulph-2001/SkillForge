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
exports.UpdateCommunityByAdminUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Community_1 = require("../../../domain/entities/Community");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
/**
 * Update Community By Admin Use Case
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community update logic for admins
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository, ICommunityMapper)
 * - Open/Closed: Can be extended without modification
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
let UpdateCommunityByAdminUseCase = class UpdateCommunityByAdminUseCase {
    constructor(userRepository, communityRepository, communityMapper) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.communityMapper = communityMapper;
    }
    async execute(request) {
        // 1. Verify user exists
        const user = await this.userRepository.findById(request.adminUserId);
        if (!user) {
            throw new AppError_1.ForbiddenError('User not found');
        }
        // 2. Verify community exists
        const community = await this.communityRepository.findById(request.communityId);
        if (!community) {
            throw new AppError_1.NotFoundError('Community not found');
        }
        // 3. Authorization: Allow both admin users AND community creator
        const isAdmin = user.role === UserRole_1.UserRole.ADMIN;
        const isCommunityCreator = community.adminId === request.adminUserId;
        if (!isAdmin && !isCommunityCreator) {
            throw new AppError_1.ForbiddenError('Only admins or community creators can edit communities');
        }
        // 4. Selective update - only update provided fields (entities are immutable)
        const updatedCommunityData = {
            ...community.toJSON(),
            name: request.name !== undefined ? request.name : community.name,
            description: request.description !== undefined ? request.description : community.description,
            category: request.category !== undefined ? request.category : community.category,
            credits_cost: request.creditsCost !== undefined ? request.creditsCost : community.creditsCost,
            credits_period: request.creditsPeriod !== undefined ? request.creditsPeriod : community.creditsPeriod,
            is_active: request.isActive !== undefined ? request.isActive : community.isActive,
            updated_at: new Date(),
        };
        // 4. Update community in repository
        const updatedCommunity = await this.communityRepository.update(request.communityId, Community_1.Community.fromDatabaseRow(updatedCommunityData));
        // 5. Return updated community DTO
        return this.communityMapper.toDTO(updatedCommunity);
    }
};
exports.UpdateCommunityByAdminUseCase = UpdateCommunityByAdminUseCase;
exports.UpdateCommunityByAdminUseCase = UpdateCommunityByAdminUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ICommunityMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateCommunityByAdminUseCase);
//# sourceMappingURL=UpdateCommunityByAdminUseCase.js.map