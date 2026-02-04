"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const container_1 = require("../../../infrastructure/di/container");
const types_1 = require("../../../infrastructure/di/types");
const asyncHandler_1 = require("../../../shared/utils/asyncHandler");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const routes_1 = require("../../../config/routes");
class ProjectRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.projectController = container_1.container.get(types_1.TYPES.ProjectController);
        this.setupRoutes();
    }
    setupRoutes() {
        // Public routes
        this.router.get(routes_1.ENDPOINTS.PROJECT.ROOT, (0, asyncHandler_1.asyncHandler)(this.projectController.listProjects.bind(this.projectController)));
        this.router.get(routes_1.ENDPOINTS.PROJECT.MY_PROJECTS, authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.getMyProjects.bind(this.projectController)));
        this.router.get(routes_1.ENDPOINTS.PROJECT.CONTRIBUTING, authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.getContributingProjects.bind(this.projectController)));
        this.router.get(routes_1.ENDPOINTS.PROJECT.BY_ID, (0, asyncHandler_1.asyncHandler)(this.projectController.getProject.bind(this.projectController)));
        this.router.post(routes_1.ENDPOINTS.PROJECT.COMPLETE, authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.requestCompletion.bind(this.projectController)));
        this.router.post(routes_1.ENDPOINTS.PROJECT.REVIEW, authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.reviewCompletion.bind(this.projectController)));
        // Protected routes (can be added later for create/update/delete)
        // this.router.post(
        //   ENDPOINTS.PROJECT.ROOT,
        //   authMiddleware,
        //   asyncHandler(this.projectController.createProject.bind(this.projectController))
        // );
    }
}
exports.ProjectRoutes = ProjectRoutes;
//# sourceMappingURL=projectRoutes.js.map