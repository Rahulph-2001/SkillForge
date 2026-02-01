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
exports.AdminSessionRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AdminSessionController_1 = require("../../../presentation/controllers/admin/AdminSessionController");
const authMiddleware_1 = require("../../../presentation/middlewares/authMiddleware");
const adminMiddleware_1 = require("../../../presentation/middlewares/adminMiddleware");
const asyncHandler_1 = require("../../../shared/utils/asyncHandler");
let AdminSessionRoutes = class AdminSessionRoutes {
    constructor(adminSessionController) {
        this.adminSessionController = adminSessionController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Apply auth and admin role check to all routes
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        this.router.get('/', (0, asyncHandler_1.asyncHandler)(this.adminSessionController.listSessions.bind(this.adminSessionController)));
        this.router.get('/stats', (0, asyncHandler_1.asyncHandler)(this.adminSessionController.getStats.bind(this.adminSessionController)));
        this.router.patch('/:id/cancel', (0, asyncHandler_1.asyncHandler)(this.adminSessionController.cancelSession.bind(this.adminSessionController)));
        this.router.patch('/:id/complete', (0, asyncHandler_1.asyncHandler)(this.adminSessionController.completeSession.bind(this.adminSessionController)));
    }
};
exports.AdminSessionRoutes = AdminSessionRoutes;
exports.AdminSessionRoutes = AdminSessionRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminSessionController)),
    __metadata("design:paramtypes", [AdminSessionController_1.AdminSessionController])
], AdminSessionRoutes);
//# sourceMappingURL=adminSessionRoutes.js.map