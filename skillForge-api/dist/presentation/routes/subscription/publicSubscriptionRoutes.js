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
exports.PublicSubscriptionRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PublicSubscriptionController_1 = require("../../controllers/subscription/PublicSubscriptionController");
const routes_1 = require("../../../config/routes");
let PublicSubscriptionRoutes = class PublicSubscriptionRoutes {
    constructor(publicSubscriptionController) {
        this.publicSubscriptionController = publicSubscriptionController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET /api/v1/subscriptions/plans - List all active subscription plans (public)
        this.router.get(routes_1.ENDPOINTS.PUBLIC_SUBSCRIPTION.PLANS, this.publicSubscriptionController.listPlans.bind(this.publicSubscriptionController));
    }
};
exports.PublicSubscriptionRoutes = PublicSubscriptionRoutes;
exports.PublicSubscriptionRoutes = PublicSubscriptionRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PublicSubscriptionController)),
    __metadata("design:paramtypes", [PublicSubscriptionController_1.PublicSubscriptionController])
], PublicSubscriptionRoutes);
//# sourceMappingURL=publicSubscriptionRoutes.js.map