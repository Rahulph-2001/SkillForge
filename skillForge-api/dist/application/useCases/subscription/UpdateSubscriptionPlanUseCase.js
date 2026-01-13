"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    constructor(userRepository, subscriptionPlanRepository, featureRepository, subscriptionPlanMapper) {
        this.userRepository = userRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.featureRepository = featureRepository;
        this.subscriptionPlanMapper = subscriptionPlanMapper;
    }
    async execute(adminUserId, planId, dto) {
        // Verify admin privileges
        const adminUser = await this.userRepository.findById(adminUserId);
        if (!adminUser || adminUser.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.ADMIN.ACCESS_REQUIRED);
        }
        // Find existing plan
        const plan = await this.subscriptionPlanRepository.findById(planId);
        if (!plan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        // Check if new name conflicts with existing plan
        if (dto.name && dto.name !== plan.name) {
            const nameExists = await this.subscriptionPlanRepository.nameExists(dto.name, planId);
            if (nameExists) {
                throw new AppError_1.ConflictError('A subscription plan with this name already exists');
            }
        }
        // Update plan properties
        if (dto.name || dto.price !== undefined || dto.projectPosts !== undefined ||
            dto.createCommunity !== undefined || dto.badge || dto.color) {
            plan.updateDetails(dto.name ?? plan.name, dto.price ?? plan.price, dto.projectPosts !== undefined ? dto.projectPosts : plan.projectPosts, dto.createCommunity !== undefined ? dto.createCommunity : plan.createCommunity, (dto.badge ?? plan.badge), dto.color ?? plan.color);
        }
        // Update active status
        if (dto.isActive !== undefined) {
            if (dto.isActive) {
                plan.activate();
            }
            else {
                plan.deactivate();
            }
        }
        // Save plan updates
        await this.subscriptionPlanRepository.update(plan);
        // Update features if provided
        if (dto.features) {
            // 1. Delete all existing features for this plan
            const existingFeatures = await this.featureRepository.findByPlanId(planId);
            if (existingFeatures.length > 0) {
                await Promise.all(existingFeatures.map(f => this.featureRepository.delete(f.id)));
            }
            // 2. Create new features
            if (dto.features.length > 0) {
                // Import dependencies
                const { Feature } = await Promise.resolve().then(() => __importStar(require('../../../domain/entities/Feature')));
                const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
                const featurePromises = dto.features.map(async (featureDto) => {
                    const feature = new Feature({
                        id: uuidv4(),
                        planId: planId,
                        name: featureDto.name,
                        description: featureDto.description,
                        featureType: featureDto.featureType,
                        limitValue: featureDto.limitValue,
                        isEnabled: featureDto.isEnabled,
                        displayOrder: featureDto.displayOrder,
                        isHighlighted: featureDto.isHighlighted,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    return this.featureRepository.create(feature);
                });
                await Promise.all(featurePromises);
            }
        }
        // Fetch updated plan with features
        const updatedPlan = await this.subscriptionPlanRepository.findById(planId);
        if (!updatedPlan) {
            throw new AppError_1.InternalServerError('Failed to retrieve updated plan');
        }
        return this.subscriptionPlanMapper.toDTO(updatedPlan);
    }
};
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase;
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UpdateSubscriptionPlanUseCase);
//# sourceMappingURL=UpdateSubscriptionPlanUseCase.js.map