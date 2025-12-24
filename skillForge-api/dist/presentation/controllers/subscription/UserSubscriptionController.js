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
exports.UserSubscriptionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const AppError_1 = require("../../../domain/errors/AppError");
let UserSubscriptionController = class UserSubscriptionController {
    constructor(getUserSubscriptionUseCase, cancelSubscriptionUseCase, responseBuilder) {
        this.getUserSubscriptionUseCase = getUserSubscriptionUseCase;
        this.cancelSubscriptionUseCase = cancelSubscriptionUseCase;
        this.responseBuilder = responseBuilder;
    }
    /**
     * GET /api/v1/subscriptions/me
     * Get current user's subscription
     */
    async getCurrentSubscription(req, res, next) {
        try {
            const userId = req.user.userId;
            try {
                const subscription = await this.getUserSubscriptionUseCase.execute(userId);
                const response = this.responseBuilder.success(subscription, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.SUBSCRIPTION_FETCHED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                // If no subscription found, return null (free plan)
                if (error instanceof AppError_1.NotFoundError) {
                    const response = this.responseBuilder.success(null, 'No active subscription');
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                throw error;
            }
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/subscriptions/cancel
     * Cancel current user's subscription
     */
    async cancelSubscription(req, res, next) {
        try {
            const userId = req.user.userId;
            const { immediately = false } = req.body;
            await this.cancelSubscriptionUseCase.execute(userId, immediately);
            const response = this.responseBuilder.success({ cancelled: true }, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.SUBSCRIPTION_CANCELLED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserSubscriptionController = UserSubscriptionController;
exports.UserSubscriptionController = UserSubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IGetUserSubscriptionUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ICancelSubscriptionUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserSubscriptionController);
//# sourceMappingURL=UserSubscriptionController.js.map