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
exports.UserSubscriptionRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserSubscriptionController_1 = require("../../controllers/subscription/UserSubscriptionController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let UserSubscriptionRoutes = class UserSubscriptionRoutes {
    constructor(controller) {
        this.controller = controller;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All routes require authentication
        this.router.use(authMiddleware_1.authMiddleware);
        // GET /api/v1/subscriptions/me - Get current user's subscription
        this.router.get('/me', this.controller.getCurrentSubscription.bind(this.controller));
        // POST /api/v1/subscriptions/cancel - Cancel subscription
        this.router.post('/cancel', this.controller.cancelSubscription.bind(this.controller));
    }
};
exports.UserSubscriptionRoutes = UserSubscriptionRoutes;
exports.UserSubscriptionRoutes = UserSubscriptionRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserSubscriptionController)),
    __metadata("design:paramtypes", [UserSubscriptionController_1.UserSubscriptionController])
], UserSubscriptionRoutes);
//# sourceMappingURL=userSubscriptionRoutes.js.map