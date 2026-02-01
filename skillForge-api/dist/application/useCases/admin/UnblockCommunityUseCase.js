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
exports.UnblockCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
/**
 * Unblock Community Use Case (Admin)
 *
 * Following SOLID Principles:
 * - Single Responsibility: Only handles community unblocking logic
 * - Dependency Inversion: Depends on interfaces (IUserRepository, ICommunityRepository)
 * - Open/Closed: Can be extended with decorators for logging, caching, etc.
 *
 * Clean Architecture:
 * - Application Layer use case
 * - Depends only on Domain layer interfaces
 * - No dependencies on Infrastructure or Presentation layers
 */
let UnblockCommunityUseCase = class UnblockCommunityUseCase {
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
        // 3. Business Rule: Check if already active
        if (community.isActive) {
            throw new AppError_1.BadRequestError('Community is already active');
        }
        // 4. Unblock community (set isActive = true)
        await this.communityRepository.unblockCommunity(request.communityId);
        // 5. Log unblocking for audit trail (if reason provided)
        if (request.reason) {
            console.log(`[UnblockCommunityUseCase] Community ${request.communityId} unblocked by admin ${request.adminUserId}. Reason: ${request.reason}`);
        }
        return {
            message: `Community "${community.name}" has been successfully unblocked`,
        };
    }
};
exports.UnblockCommunityUseCase = UnblockCommunityUseCase;
exports.UnblockCommunityUseCase = UnblockCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UnblockCommunityUseCase);
//# sourceMappingURL=UnblockCommunityUseCase.js.map