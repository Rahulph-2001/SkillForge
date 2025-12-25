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
exports.ReactivateSubscriptionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let ReactivateSubscriptionUseCase = class ReactivateSubscriptionUseCase {
    constructor(subscriptionRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new AppError_1.NotFoundError('No active or canceled subscription found');
        }
        // Only allow reactivation if it's scheduled to cancel (has cancelAt endpoint) or canceled but not expired?
        // Actually, "Reactivate" usually means "Undo Cancel" (scheduled cancellation).
        // If it is ALREADY CANCELED (expired) or PAST_DUE, they generally need to Pay (Activate/Extend).
        // So this use case is specifically for "Undo Cancel".
        if (!subscription.willCancelAtPeriodEnd()) {
            throw new AppError_1.ConflictError('Subscription is not scheduled for cancellation');
        }
        // Logic: Clear cancellation flags
        subscription.reactivate();
        // UserSubscription entity's reactivate() method clears canceledAt, cancelAt, and sets status to ACTIVE.
        await this.subscriptionRepository.update(subscription);
        // Sync User Entity
        const user = await this.userRepository.findById(userId);
        if (user) {
            // Update autoRenew to true. We don't change dates.
            // Check User entity method. activateSubscription might be too heavy (sets dates).
            // We might need a generic update or just re-call activate with same dates.
            // user.activateSubscription(plan, end, start, autoRenew=true)
            // We need plan name.
            let planName = 'starter'; // Default fallback, but we should fetch plan or store it.
            // The UserSubscription entity has planId. The User entity has subscription.plan.
            // We can trust existing User entity data if we just want to flip the boolean.
            // However, looking at User entity (viewed previously), it might not have fine-grained setters.
            // activateSubscription overwrites.
            // Let's assume we can re-call activateSubscription with existing user data but autoRenew=true.
            const currentPlan = user.subscriptionPlan;
            const currentEnd = user.subscriptionValidUntil;
            const currentStart = user.subscriptionStartedAt;
            if (currentPlan && currentEnd && currentStart) {
                user.activateSubscription(currentPlan, currentEnd, currentStart, true);
                await this.userRepository.update(user);
            }
        }
    }
};
exports.ReactivateSubscriptionUseCase = ReactivateSubscriptionUseCase;
exports.ReactivateSubscriptionUseCase = ReactivateSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ReactivateSubscriptionUseCase);
//# sourceMappingURL=ReactivateSubscriptionUseCase.js.map