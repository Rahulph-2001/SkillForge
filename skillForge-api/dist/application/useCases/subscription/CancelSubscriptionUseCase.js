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
exports.CancelSubscriptionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserSubscriptionMapper_1 = require("../../mappers/UserSubscriptionMapper");
const AppError_1 = require("../../../domain/errors/AppError");
let CancelSubscriptionUseCase = class CancelSubscriptionUseCase {
    constructor(subscriptionRepository, planRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }
    async execute(userId, immediate = false) {
        // Find user's subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new AppError_1.NotFoundError('User does not have an active subscription');
        }
        // Check if already canceled
        if (subscription.canceledAt) {
            throw new AppError_1.ConflictError('Subscription is already canceled');
        }
        // Cancel subscription
        if (immediate) {
            subscription.cancelImmediately();
        }
        else {
            subscription.cancelAtPeriodEnd();
        }
        // Save updated subscription
        const updated = await this.subscriptionRepository.update(subscription);
        // SYNC USER ENTITY
        try {
            const user = await this.userRepository.findById(userId);
            if (user) {
                if (immediate) {
                    // Revert to free immediately
                    user.activateSubscription('free', new Date(), // valid until now
                    undefined, false // no auto renew
                    );
                }
                else {
                    // Just turn off auto-renew
                    // We need to keep the current plan and validity
                    // But User entity activateSubscription overwrites everything.
                    // We need a way to just set autoRenew = false.
                    // Or call activateSubscription with existing values but autoRenew=false
                    user.activateSubscription(user.subscriptionPlan, user.subscriptionValidUntil || subscription.currentPeriodEnd, user.subscriptionStartedAt || subscription.currentPeriodStart, false // DISABLE auto-renew
                    );
                }
                await this.userRepository.update(user);
                console.log('[CancelSubscriptionUseCase] Synced user entity subscription data');
            }
        }
        catch (error) {
            console.error('[CancelSubscriptionUseCase] Failed to sync user entity:', error);
        }
        // Get plan details
        const plan = await this.planRepository.findById(updated.planId);
        // Map to DTO
        return UserSubscriptionMapper_1.UserSubscriptionMapper.toDTO(updated, plan?.name);
    }
};
exports.CancelSubscriptionUseCase = CancelSubscriptionUseCase;
exports.CancelSubscriptionUseCase = CancelSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CancelSubscriptionUseCase);
//# sourceMappingURL=CancelSubscriptionUseCase.js.map