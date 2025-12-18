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
exports.UpdateSubscriptionPlanUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const messages_1 = require("../../../config/messages");
let UpdateSubscriptionPlanUseCase = class UpdateSubscriptionPlanUseCase {
    constructor(userRepository, subscriptionPlanRepository, subscriptionPlanMapper) {
        this.userRepository = userRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionPlanMapper = subscriptionPlanMapper;
    }
    async execute(adminUserId, dto) {
        // Verify admin privileges
        const adminUser = await this.userRepository.findById(adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // Find existing plan
        const existingPlan = await this.subscriptionPlanRepository.findById(dto.planId);
        if (!existingPlan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        // Check if new name conflicts with another plan
        if (dto.name !== existingPlan.name) {
            const nameExists = await this.subscriptionPlanRepository.nameExists(dto.name, dto.planId);
            if (nameExists) {
                throw new AppError_1.ConflictError('A subscription plan with this name already exists');
            }
        }
        // Generate feature IDs for new features
        const features = dto.features.map((feature, index) => ({
            id: feature.id || `${Date.now()}-${index}`,
            name: feature.name,
        }));
        // Update domain entity
        existingPlan.updateDetails(dto.name, dto.price, dto.projectPosts, dto.communityPosts, dto.badge, dto.color);
        // Update features
        existingPlan.setFeatures(features);
        // Save to repository
        const updatedPlan = await this.subscriptionPlanRepository.update(existingPlan);
        return this.subscriptionPlanMapper.toDTO(updatedPlan);
    }
};
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase;
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateSubscriptionPlanUseCase);
//# sourceMappingURL=UpdateSubscriptionPlanUseCase.js.map