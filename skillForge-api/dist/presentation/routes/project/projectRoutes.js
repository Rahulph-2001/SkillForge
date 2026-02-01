"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const container_1 = require("../../../infrastructure/di/container");
const types_1 = require("../../../infrastructure/di/types");
const asyncHandler_1 = require("../../../shared/utils/asyncHandler");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
class ProjectRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.projectController = container_1.container.get(types_1.TYPES.ProjectController);
        this.setupRoutes();
    }
    setupRoutes() {
        // Public routes
        this.router.get('/', (0, asyncHandler_1.asyncHandler)(this.projectController.listProjects.bind(this.projectController)));
        this.router.get('/my-projects', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.getMyProjects.bind(this.projectController)));
        this.router.get('/contributing', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.getContributingProjects.bind(this.projectController)));
        this.router.get('/:id', (0, asyncHandler_1.asyncHandler)(this.projectController.getProject.bind(this.projectController)));
        this.router.post('/:id/complete', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.requestCompletion.bind(this.projectController)));
        this.router.post('/:id/review', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(this.projectController.reviewCompletion.bind(this.projectController)));
        // Protected routes (can be added later for create/update/delete)
        // this.router.post(
        //   '/',
        //   authMiddleware,
        //   asyncHandler(this.projectController.createProject.bind(this.projectController))
        // );
    }
}
exports.ProjectRoutes = ProjectRoutes;
//# sourceMappingURL=projectRoutes.js.map