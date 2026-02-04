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
exports.MCQTestRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const MCQTestController_1 = require("../../controllers/mcq/MCQTestController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const routes_1 = require("../../../config/routes");
let MCQTestRoutes = class MCQTestRoutes {
    constructor(mcqTestController) {
        this.mcqTestController = mcqTestController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get(routes_1.ENDPOINTS.MCQ_TEST.START_BY_SKILL, authMiddleware_1.authMiddleware, this.mcqTestController.startTest);
        this.router.post(routes_1.ENDPOINTS.MCQ_TEST.SUBMIT, authMiddleware_1.authMiddleware, this.mcqTestController.submitTest);
    }
    getRouter() {
        return this.router;
    }
};
exports.MCQTestRoutes = MCQTestRoutes;
exports.MCQTestRoutes = MCQTestRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.MCQTestController)),
    __metadata("design:paramtypes", [MCQTestController_1.MCQTestController])
], MCQTestRoutes);
//# sourceMappingURL=mcqTestRoutes.js.map