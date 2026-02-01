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
exports.DeleteCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
/**
 * Delete Community Use Case (Admin)
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community deletion logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
let DeleteCommunityUseCase = class DeleteCommunityUseCase {
    constructor(userRepository, communityRepository) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
    }
    async execute(request) {
        // 1. Verify admin user (Authorization)
        const adminUser = await this.userRepository.findById(request.adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // 2. Verify community exists
        const community = await this.communityRepository.findById(request.communityId);
        if (!community) {
            throw new AppError_1.NotFoundError('Community not found');
        }
        // 3. Business Rule: Check if community has active members
        // For now, we'll allow deletion regardless, but log a warning
        // In production, you might want to prevent deletion or require a force flag
        if (community.membersCount > 0) {
            console.warn(`[DeleteCommunityUseCase] Deleting community ${request.communityId} with ${community.membersCount} active members`);
            // Optional: Throw error to prevent deletion
            // throw new BadRequestError(`Cannot delete community with ${community.membersCount} active members`);
        }
        // 4. Delete community (soft delete via BaseRepository)
        await this.communityRepository.delete(request.communityId);
        // 5. Log deletion for audit trail (if reason provided)
        if (request.reason) {
            console.log(`[DeleteCommunityUseCase] Community ${request.communityId} deleted by admin ${request.adminUserId}. Reason: ${request.reason}`);
        }
        return {
            message: `Community "${community.name}" has been successfully deleted`,
        };
    }
};
exports.DeleteCommunityUseCase = DeleteCommunityUseCase;
exports.DeleteCommunityUseCase = DeleteCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DeleteCommunityUseCase);
//# sourceMappingURL=DeleteCommunityUseCase.js.map