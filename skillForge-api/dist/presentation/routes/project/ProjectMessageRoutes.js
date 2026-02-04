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
exports.ProjectMessageRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProjectMessageController_1 = require("../../controllers/project/ProjectMessageController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const routes_1 = require("../../../config/routes");
let ProjectMessageRoutes = class ProjectMessageRoutes {
    constructor(controller) {
        this.controller = controller;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // These routes will be mounted under /projects/:projectId/messages
        // OR /messages/project/:projectId if needed, but nesting is better.
        // Assuming this router is mounted at /projects/:projectId/messages or similar
        // Let's implement full paths assuming it is mounted at API root or under project
        // Actually, cleaner design is:
        // GET /projects/:projectId/messages
        // POST /projects/:projectId/messages
        this.router.get(routes_1.ENDPOINTS.PROJECT_MESSAGE.GET_MESSAGES, authMiddleware_1.authMiddleware, this.controller.getMessages);
        this.router.post(routes_1.ENDPOINTS.PROJECT_MESSAGE.SEND_MESSAGE, authMiddleware_1.authMiddleware, this.controller.sendMessage);
    }
};
exports.ProjectMessageRoutes = ProjectMessageRoutes;
exports.ProjectMessageRoutes = ProjectMessageRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ProjectMessageController)),
    __metadata("design:paramtypes", [ProjectMessageController_1.ProjectMessageController])
], ProjectMessageRoutes);
//# sourceMappingURL=ProjectMessageRoutes.js.map