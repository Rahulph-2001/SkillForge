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
exports.ProjectApplicationRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const ProjectApplicationController_1 = require("../../controllers/projectApplication/ProjectApplicationController");
const types_1 = require("../../../infrastructure/di/types");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let ProjectApplicationRoutes = class ProjectApplicationRoutes {
    constructor(projectApplicationController) {
        this.projectApplicationController = projectApplicationController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Apply to a project
        this.router.post('/projects/:projectId/apply', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.applyToProject(req, res, next));
        // Get applications for a project (Project Owner)
        this.router.get('/projects/:projectId/applications', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.getProjectApplications(req, res, next));
        // Get my applications
        this.router.get('/my-applications', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.getMyApplications(req, res, next));
        // Get received applications
        this.router.get('/received', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.getReceivedApplications(req, res, next));
        // Update application status (Project Owner)
        this.router.patch('/:applicationId/status', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.updateStatus(req, res, next));
        // Withdraw application
        this.router.post('/:applicationId/withdraw', authMiddleware_1.authMiddleware, (req, res, next) => this.projectApplicationController.withdrawApplication(req, res, next));
    }
};
exports.ProjectApplicationRoutes = ProjectApplicationRoutes;
exports.ProjectApplicationRoutes = ProjectApplicationRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ProjectApplicationController)),
    __metadata("design:paramtypes", [ProjectApplicationController_1.ProjectApplicationController])
], ProjectApplicationRoutes);
//# sourceMappingURL=ProjectApplicationRoutes.js.map