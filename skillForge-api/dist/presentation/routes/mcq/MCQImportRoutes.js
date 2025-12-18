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
exports.MCQImportRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const MCQImportController_1 = require("../../controllers/mcq/MCQImportController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminMiddleware_1 = require("../../middlewares/adminMiddleware");
const multer_1 = require("../../../config/multer");
let MCQImportRoutes = class MCQImportRoutes {
    constructor(mcqImportController) {
        this.mcqImportController = mcqImportController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.use(authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware);
        this.router.post('/:templateId/import', multer_1.uploadImportFile.single('csvFile'), this.mcqImportController.startImport);
        this.router.get('/:templateId/status', this.mcqImportController.listJobs);
        this.router.get('/errors/:jobId/download', this.mcqImportController.downloadErrors);
    }
    getRouter() {
        return this.router;
    }
};
exports.MCQImportRoutes = MCQImportRoutes;
exports.MCQImportRoutes = MCQImportRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.MCQImportController)),
    __metadata("design:paramtypes", [MCQImportController_1.MCQImportController])
], MCQImportRoutes);
//# sourceMappingURL=MCQImportRoutes.js.map