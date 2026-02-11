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
exports.CreditPackageRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const CreditPackageDTO_1 = require("../../../application/dto/credit/CreditPackageDTO");
const routes_1 = require("../../../config/routes");
const CreditPackageController_1 = require("../../controllers/credit/CreditPackageController");
let CreditPackageRoutes = class CreditPackageRoutes {
    constructor(controller) {
        this.controller = controller;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // All routes require admin authentication
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.post(routes_1.ENDPOINTS.COMMON.ROOT, (0, validationMiddleware_1.validateBody)(CreditPackageDTO_1.CreateCreditPackageSchema), this.controller.create);
        this.router.get(routes_1.ENDPOINTS.COMMON.ROOT, this.controller.list);
        this.router.put(routes_1.ENDPOINTS.COMMON.BY_ID, (0, validationMiddleware_1.validateBody)(CreditPackageDTO_1.UpdateCreditPackageSchema), this.controller.update);
        this.router.delete(routes_1.ENDPOINTS.COMMON.BY_ID, this.controller.delete);
    }
};
exports.CreditPackageRoutes = CreditPackageRoutes;
exports.CreditPackageRoutes = CreditPackageRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CreditPackageController)),
    __metadata("design:paramtypes", [CreditPackageController_1.CreditPackageController])
], CreditPackageRoutes);
//# sourceMappingURL=CreditPackageRoutes.js.map