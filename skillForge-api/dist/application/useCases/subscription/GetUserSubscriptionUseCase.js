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
    constructor(subscriptionRepository, planRepository, userSubscriptionMapper) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
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
        // Map to DTO with plan name
        return this.userSubscriptionMapper.toDTO(subscription, plan.name);
    }
};
exports.GetUserSubscriptionUseCase = GetUserSubscriptionUseCase;
exports.GetUserSubscriptionUseCase = GetUserSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetUserSubscriptionUseCase);
//# sourceMappingURL=GetUserSubscriptionUseCase.js.map