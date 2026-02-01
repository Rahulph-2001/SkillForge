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
exports.GetUserSubscriptionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetUserSubscriptionUseCase = class GetUserSubscriptionUseCase {
    constructor(subscriptionRepository, planRepository, usageRecordRepository, featureRepository, userSubscriptionMapper) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.usageRecordRepository = usageRecordRepository;
        this.featureRepository = featureRepository;
        this.userSubscriptionMapper = userSubscriptionMapper;
    }
    async execute(userId) {
        // Find user's subscription
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new AppError_1.NotFoundError('User does not have an active subscription');
        }
        // Get plan details
        const plan = await this.planRepository.findById(subscription.planId);
        if (!plan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        // Fetch usage records for the current period
        const usageRecords = await this.usageRecordRepository.findBySubscriptionId(subscription.id);
        const currentUsageRecords = usageRecords.filter(r => r.periodStart.getTime() === subscription.currentPeriodStart.getTime());
        // Fetch features to build limits object
        const features = await this.featureRepository.findByPlanId(plan.id);
        const planLimits = {};
        // 1. Map Legacy Limits
        if (plan.projectPosts !== null)
            planLimits['project_posts'] = plan.projectPosts;
        if (plan.createCommunity !== null)
            planLimits['create_community'] = plan.createCommunity;
        // 2. Map Feature Limits (Override legacy if present)
        features.forEach(f => {
            if (f.limitValue !== null) {
                // Determine key (snake_case conversion if needed, but usually exact match expected by frontend)
                // We'll trust the feature name is the key or map common ones
                const key = f.name.toLowerCase().replace(/ /g, '_');
                planLimits[key] = f.limitValue;
            }
            else if (f.featureType === 'BOOLEAN' && f.isEnabled) {
                // Boolean features are usually "Unlimited" (-1) if just presence checked
                const key = f.name.toLowerCase().replace(/ /g, '_');
                // Only add if not already present or if we want to show boolean features as usage
                // Usually usage only makes sense for limits. 
                // We can skip boolean features for usage tracking unless we want to show "Active"
            }
        });
        // Map to DTO with plan name and usage stats
        return this.userSubscriptionMapper.toDTO(subscription, plan.name, currentUsageRecords, planLimits);
    }
};
exports.GetUserSubscriptionUseCase = GetUserSubscriptionUseCase;
exports.GetUserSubscriptionUseCase = GetUserSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IFeatureRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetUserSubscriptionUseCase);
//# sourceMappingURL=GetUserSubscriptionUseCase.js.map