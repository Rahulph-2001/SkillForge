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
const routes_1 = require("../../../config/routes");
let MCQImportRoutes = class MCQImportRoutes {
    constructor(mcqImportController) {
        this.mcqImportController = mcqImportController;
        console.log('[MCQImportRoutes] Constructor called - initializing routes');
        this.router = (0, express_1.Router)();
        this.setupRoutes();
        console.log('[MCQImportRoutes] Routes setup complete');
    }
    setupRoutes() {
        console.log('[MCQImportRoutes] Setting up MCQ import routes');
        this.router.use(authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware);
        // Add logging middleware to track requests
        this.router.use((req, _res, next) => {
            console.log('[MCQImportRoutes] Request received:', {
                method: req.method,
                path: req.path,
                params: req.params,
                hasFile: !!req.file
            });
            next();
        });
        this.router.post(routes_1.ENDPOINTS.MCQ_IMPORT.START_IMPORT, multer_1.uploadImportFile.single('csvFile'), this.mcqImportController.startImport);
        this.router.get(routes_1.ENDPOINTS.MCQ_IMPORT.STATUS, this.mcqImportController.listJobs);
        this.router.get(routes_1.ENDPOINTS.MCQ_IMPORT.DOWNLOAD_ERRORS, this.mcqImportController.downloadErrors);
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