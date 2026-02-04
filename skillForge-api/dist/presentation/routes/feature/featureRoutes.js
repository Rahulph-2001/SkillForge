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
exports.FeatureRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const FeatureController_1 = require("../../controllers/feature/FeatureController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const routes_1 = require("../../../config/routes");
let FeatureRoutes = class FeatureRoutes {
    constructor(featureController) {
        this.featureController = featureController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All feature routes require admin authentication
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.use(adminMiddleware_1.adminMiddleware);
        // POST /api/v1/admin/features - Create feature
        this.router.post(routes_1.ENDPOINTS.FEATURE.ROOT, (req, res, next) => this.featureController.createFeature(req, res, next));
        // GET /api/v1/admin/features - List features
        this.router.get(routes_1.ENDPOINTS.FEATURE.ROOT, (req, res, next) => this.featureController.listFeatures(req, res, next));
        // GET /api/v1/admin/features/:id - Get feature by ID
        this.router.get(routes_1.ENDPOINTS.FEATURE.BY_ID, (req, res, next) => this.featureController.getFeature(req, res, next));
        // PUT /api/v1/admin/features/:id - Update feature
        this.router.put(routes_1.ENDPOINTS.FEATURE.BY_ID, (req, res, next) => this.featureController.updateFeature(req, res, next));
        // DELETE /api/v1/admin/features/:id - Delete feature
        this.router.delete(routes_1.ENDPOINTS.FEATURE.BY_ID, (req, res, next) => this.featureController.deleteFeature(req, res, next));
    }
};
exports.FeatureRoutes = FeatureRoutes;
exports.FeatureRoutes = FeatureRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.FeatureController)),
    __metadata("design:paramtypes", [FeatureController_1.FeatureController])
], FeatureRoutes);
//# sourceMappingURL=featureRoutes.js.map