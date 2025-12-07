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
exports.SubscriptionRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const SubscriptionController_1 = require("../../controllers/subscription/SubscriptionController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
let SubscriptionRoutes = class SubscriptionRoutes {
    constructor(subscriptionController) {
        this.subscriptionController = subscriptionController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All subscription routes require authentication and admin role
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        // GET /api/v1/admin/subscriptions/plans - List all subscription plans
        this.router.get('/plans', this.subscriptionController.listPlans.bind(this.subscriptionController));
        // GET /api/v1/admin/subscriptions/stats - Get subscription statistics
        this.router.get('/stats', this.subscriptionController.getStats.bind(this.subscriptionController));
        // POST /api/v1/admin/subscriptions/plans - Create new subscription plan
        this.router.post('/plans', this.subscriptionController.createPlan.bind(this.subscriptionController));
        // PUT /api/v1/admin/subscriptions/plans/:id - Update subscription plan
        this.router.put('/plans/:id', this.subscriptionController.updatePlan.bind(this.subscriptionController));
        // DELETE /api/v1/admin/subscriptions/plans/:id - Delete subscription plan
        this.router.delete('/plans/:id', this.subscriptionController.deletePlan.bind(this.subscriptionController));
    }
};
exports.SubscriptionRoutes = SubscriptionRoutes;
exports.SubscriptionRoutes = SubscriptionRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SubscriptionController)),
    __metadata("design:paramtypes", [SubscriptionController_1.SubscriptionController])
], SubscriptionRoutes);
//# sourceMappingURL=subscriptionRoutes.js.map