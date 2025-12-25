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
exports.UserDTOMapper = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
let UserDTOMapper = class UserDTOMapper {
    constructor(subscriptionRepository, planRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
    }
    async toUserResponseDTO(user) {
        // Fetch active subscription to get real plan name
        let subscriptionPlan = user.subscriptionPlan; // Default to user's stored plan
        try {
            const subscription = await this.subscriptionRepository.findByUserId(user.id);
            if (subscription && subscription.status === 'ACTIVE') {
                const plan = await this.planRepository.findById(subscription.planId);
                if (plan) {
                    // Map plan badge to subscription plan type (badge is the tier: Free, Starter, Professional, Enterprise)
                    subscriptionPlan = plan.badge.toLowerCase();
                }
            }
        }
        catch (error) {
            // If subscription fetch fails, fall back to user's stored plan
            console.warn(`Failed to fetch subscription for user ${user.id}:`, error);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email.value,
            role: user.role,
            credits: user.credits,
            subscriptionPlan,
            avatarUrl: user.avatarUrl,
            verification: {
                email_verified: user.verification.email_verified
            }
        };
    }
};
exports.UserDTOMapper = UserDTOMapper;
exports.UserDTOMapper = UserDTOMapper = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UserDTOMapper);
//# sourceMappingURL=UserDTOMapper.js.map