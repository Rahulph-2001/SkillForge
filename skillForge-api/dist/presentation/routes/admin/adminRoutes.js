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
const featureRoutes_1 = require("../feature/featureRoutes");
const ProjectPaymentRequestController_1 = require("../../controllers/admin/ProjectPaymentRequestController");
const AdminProjectController_1 = require("../../controllers/admin/AdminProjectController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const routes_1 = require("../../../config/routes");
let AdminRoutes = class AdminRoutes {
    constructor(adminController, subscriptionRoutes, featureRoutes, paymentRequestController, adminProjectController) {
        this.adminController = adminController;
        this.subscriptionRoutes = subscriptionRoutes;
        this.featureRoutes = featureRoutes;
        this.paymentRequestController = paymentRequestController;
        this.adminProjectController = adminProjectController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All admin routes require authentication and admin role
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        // User Management Routes
        // GET /api/v1/admin/users - List all users
        this.router.get(routes_1.ENDPOINTS.ADMIN.USERS, this.adminController.listUsers.bind(this.adminController));
        // POST /api/v1/admin/users/suspend - Suspend a user
        this.router.post(routes_1.ENDPOINTS.ADMIN.USERS_SUSPEND, this.adminController.suspendUser.bind(this.adminController));
        // POST /api/v1/admin/users/unsuspend - Unsuspend (reactivate) a user
        this.router.post(routes_1.ENDPOINTS.ADMIN.USERS_UNSUSPEND, this.adminController.unsuspendUser.bind(this.adminController));
        // Community Management Routes
        // GET /api/v1/admin/communities - List all communities with pagination and search
        this.router.get(routes_1.ENDPOINTS.ADMIN.COMMUNITIES, this.adminController.listCommunities.bind(this.adminController));
        // PUT /api/v1/admin/communities/:id - Update community
        this.router.put(routes_1.ENDPOINTS.ADMIN.COMMUNITY_BY_ID, this.adminController.updateCommunity.bind(this.adminController));
        // POST /api/v1/admin/communities/:id/block - Block community
        this.router.post(routes_1.ENDPOINTS.ADMIN.COMMUNITY_BLOCK, this.adminController.blockCommunity.bind(this.adminController));
        // POST /api/v1/admin/communities/:id/unblock - Unblock community
        this.router.post(routes_1.ENDPOINTS.ADMIN.COMMUNITY_UNBLOCK, this.adminController.unblockCommunity.bind(this.adminController));
        // Subscription Management Routes
        // Mount subscription routes at /api/v1/admin/subscriptions
        this.router.use(routes_1.ENDPOINTS.ADMIN.SUBSCRIPTIONS, this.subscriptionRoutes.router);
        // Feature Management Routes
        // Mount feature routes at /api/v1/admin/features
        this.router.use(routes_1.ENDPOINTS.ADMIN.FEATURES, this.featureRoutes.router);
        // Project Management Routes
        // GET /api/v1/admin/projects - List all projects
        this.router.get(routes_1.ENDPOINTS.ADMIN.PROJECTS, this.adminProjectController.listProjects.bind(this.adminProjectController));
        // GET /api/v1/admin/projects/stats - Get project statistics
        this.router.get(routes_1.ENDPOINTS.ADMIN.PROJECTS_STATS, this.adminProjectController.getProjectStats.bind(this.adminProjectController));
        // GET /api/v1/admin/projects/:projectId - Get project details
        this.router.get(routes_1.ENDPOINTS.ADMIN.PROJECT_BY_ID, this.adminProjectController.getProjectDetails.bind(this.adminProjectController));
        // POST /api/v1/admin/projects/:projectId/suspend - Suspend a project
        this.router.post(routes_1.ENDPOINTS.ADMIN.PROJECT_SUSPEND, this.adminProjectController.suspendProject.bind(this.adminProjectController));
        // Project Payment Requests
        // GET /api/v1/admin/payment-requests/pending
        this.router.get(routes_1.ENDPOINTS.ADMIN.PAYMENT_REQUESTS_PENDING, this.paymentRequestController.getPendingPaymentRequests.bind(this.paymentRequestController));
        // POST /api/v1/admin/payment-requests/:id/process
        this.router.post(routes_1.ENDPOINTS.ADMIN.PAYMENT_REQUEST_PROCESS, this.paymentRequestController.processPaymentRequest.bind(this.paymentRequestController));
    }
};
exports.AdminRoutes = AdminRoutes;
exports.AdminRoutes = AdminRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminController)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SubscriptionRoutes)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.FeatureRoutes)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ProjectPaymentRequestController)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.AdminProjectController)),
    __metadata("design:paramtypes", [AdminController_1.AdminController,
        subscriptionRoutes_1.SubscriptionRoutes,
        featureRoutes_1.FeatureRoutes,
        ProjectPaymentRequestController_1.ProjectPaymentRequestController,
        AdminProjectController_1.AdminProjectController])
], AdminRoutes);
//# sourceMappingURL=adminRoutes.js.map