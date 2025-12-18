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
exports.AdminRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AdminController_1 = require("../../controllers/admin/AdminController");
const subscriptionRoutes_1 = require("../subscription/subscriptionRoutes");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
let AdminRoutes = class AdminRoutes {
    constructor(adminController, subscriptionRoutes) {
        this.adminController = adminController;
        this.subscriptionRoutes = subscriptionRoutes;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All admin routes require authentication and admin role
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        // User Management Routes
        // GET /api/v1/admin/users - List all users
        this.router.get('/users', this.adminController.listUsers.bind(this.adminController));
        // POST /api/v1/admin/users/suspend - Suspend a user
        this.router.post('/users/suspend', this.adminController.suspendUser.bind(this.adminController));
        // POST /api/v1/admin/users/unsuspend - Unsuspend (reactivate) a user
        this.router.post('/users/unsuspend', this.adminController.unsuspendUser.bind(this.adminController));
        // Subscription Management Routes
        // Mount subscription routes at /api/v1/admin/subscriptions
        this.router.use('/subscriptions', this.subscriptionRoutes.router);
    }
};
exports.AdminRoutes = AdminRoutes;
exports.AdminRoutes = AdminRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminController)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SubscriptionRoutes)),
    __metadata("design:paramtypes", [AdminController_1.AdminController,
        subscriptionRoutes_1.SubscriptionRoutes])
], AdminRoutes);
//# sourceMappingURL=adminRoutes.js.map