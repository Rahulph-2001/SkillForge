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
exports.AdminReportRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AdminReportController_1 = require("../../controllers/admin/AdminReportController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const routes_1 = require("../../../config/routes");
let AdminReportRoutes = class AdminReportRoutes {
    constructor(adminReportController) {
        this.adminReportController = adminReportController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        this.router.get(routes_1.ENDPOINTS.ADMIN_REPORT.ROOT, (req, res, next) => this.adminReportController.listReports(req, res, next));
        this.router.patch(routes_1.ENDPOINTS.ADMIN_REPORT.RESOLUTION, (req, res, next) => this.adminReportController.manageReport(req, res, next));
    }
};
exports.AdminReportRoutes = AdminReportRoutes;
exports.AdminReportRoutes = AdminReportRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminReportController)),
    __metadata("design:paramtypes", [AdminReportController_1.AdminReportController])
], AdminReportRoutes);
//# sourceMappingURL=AdminReportRoutes.js.map