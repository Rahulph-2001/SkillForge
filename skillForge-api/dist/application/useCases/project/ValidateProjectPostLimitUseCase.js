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
exports.ValidateProjectPostLimitUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let ValidateProjectPostLimitUseCase = class ValidateProjectPostLimitUseCase {
    constructor(subscriptionRepository, planRepository, usageRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.usageRepository = usageRepository;
    }
    async execute(userId) {
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new AppError_1.ForbiddenError('You must have an active subscription to post projects');
        }
        if (!subscription.isActive()) {
            throw new AppError_1.ForbiddenError('Your subscription is not active. Please activate or renew your subscription to post projects');
        }
        const plan = await this.planRepository.findById(subscription.planId);
        if (!plan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        if (plan.hasUnlimitedProjectPosts()) {
            return;
        }
        const projectPostsLimit = plan.projectPosts;
        if (projectPostsLimit === null || projectPostsLimit === -1) {
            return;
        }
        const usageRecord = await this.usageRepository.findBySubscriptionAndFeature(subscription.id, 'project_posts', subscription.currentPeriodStart, subscription.currentPeriodEnd);
        const currentUsage = usageRecord?.usageCount || 0;
        if (currentUsage >= projectPostsLimit) {
            throw new AppError_1.ForbiddenError(`You have reached your project post limit (${projectPostsLimit} posts per ${this.getBillingPeriodText(subscription)}). Please upgrade your plan to post more projects.`);
        }
    }
    getBillingPeriodText(subscription) {
        const days = Math.ceil((subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 31)
            return 'month';
        if (days <= 93)
            return 'quarter';
        if (days <= 366)
            return 'year';
        return 'billing period';
    }
};
exports.ValidateProjectPostLimitUseCase = ValidateProjectPostLimitUseCase;
exports.ValidateProjectPostLimitUseCase = ValidateProjectPostLimitUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUsageRecordRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ValidateProjectPostLimitUseCase);
//# sourceMappingURL=ValidateProjectPostLimitUseCase.js.map