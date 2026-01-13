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
exports.SubscriptionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
let SubscriptionController = class SubscriptionController {
    constructor(listPlansUseCase, getStatsUseCase, createPlanUseCase, updatePlanUseCase, deletePlanUseCase, responseBuilder) {
        this.listPlansUseCase = listPlansUseCase;
        this.getStatsUseCase = getStatsUseCase;
        this.createPlanUseCase = createPlanUseCase;
        this.updatePlanUseCase = updatePlanUseCase;
        this.deletePlanUseCase = deletePlanUseCase;
        this.responseBuilder = responseBuilder;
    }
    /**
     * GET /api/v1/admin/subscriptions/plans
     * List all subscription plans
     */
    async listPlans(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
            const result = await this.listPlansUseCase.execute({
                adminUserId,
                page,
                limit,
                isActive
            });
            const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.PLANS_FETCHED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/subscriptions/stats
     * Get subscription statistics
     */
    async getStats(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const stats = await this.getStatsUseCase.execute(adminUserId);
            const response = this.responseBuilder.success(stats, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.STATS_FETCHED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/admin/subscriptions/plans
     * Create a new subscription plan
     */
    async createPlan(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const dto = req.body;
            const plan = await this.createPlanUseCase.execute(adminUserId, dto);
            const response = this.responseBuilder.success(plan, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_CREATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/admin/subscriptions/plans/:id
     * Update an existing subscription plan
     */
    async updatePlan(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const planId = req.params.id;
            const dto = req.body;
            const plan = await this.updatePlanUseCase.execute(adminUserId, planId, dto);
            const response = this.responseBuilder.success(plan, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_UPDATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/admin/subscriptions/plans/:id
     * Delete (soft delete) a subscription plan
     */
    async deletePlan(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const planId = req.params.id;
            await this.deletePlanUseCase.execute(adminUserId, planId);
            const response = this.responseBuilder.success({ message: messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_DELETED }, messages_1.SUCCESS_MESSAGES.SUBSCRIPTION.PLAN_DELETED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.SubscriptionController = SubscriptionController;
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IListSubscriptionPlansUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetSubscriptionStatsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ICreateSubscriptionPlanUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUpdateSubscriptionPlanUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IDeleteSubscriptionPlanUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], SubscriptionController);
//# sourceMappingURL=SubscriptionController.js.map