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
exports.CheckSubscriptionExpiryUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let CheckSubscriptionExpiryUseCase = class CheckSubscriptionExpiryUseCase {
    constructor(subscriptionRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }
    async execute() {
        const now = new Date();
        const expiredSubscriptions = await this.subscriptionRepository.findExpiredActiveSubscriptions(now);
        if (expiredSubscriptions.length === 0) {
            return;
        }
        for (const subscription of expiredSubscriptions) {
            try {
                // Skip lifetime subscriptions (they have far future end dates)
                // The query should already filter these out, but double-check
                const yearsUntilExpiry = (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                if (yearsUntilExpiry > 50) {
                    continue; // Likely a lifetime subscription
                }
                // Expire the subscription
                subscription.expire();
                await this.subscriptionRepository.update(subscription);
                // Update User entity to reflect expired subscription
                const user = await this.userRepository.findById(subscription.userId);
                if (user) {
                    user.deactivateSubscription();
                    await this.userRepository.update(user);
                }
            }
            catch (error) {
                console.error(`[CheckSubscriptionExpiryUseCase] Failed to expire subscription ${subscription.id}:`, error);
            }
        }
    }
};
exports.CheckSubscriptionExpiryUseCase = CheckSubscriptionExpiryUseCase;
exports.CheckSubscriptionExpiryUseCase = CheckSubscriptionExpiryUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CheckSubscriptionExpiryUseCase);
//# sourceMappingURL=CheckSubscriptionExpiryUseCase.js.map