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
exports.BrowseSkillsRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const BrowseSkillsController_1 = require("../../controllers/BrowseSkillsController");
const SkillDetailsController_1 = require("../../controllers/skill/SkillDetailsController");
let BrowseSkillsRoutes = class BrowseSkillsRoutes {
    constructor(browseSkillsController, skillDetailsController) {
        this.browseSkillsController = browseSkillsController;
        this.skillDetailsController = skillDetailsController;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        // Public routes - no authentication required
        this.router.get('/browse', this.browseSkillsController.browse);
        this.router.get('/:skillId', this.skillDetailsController.getDetails);
    }
    getRouter() {
        return this.router;
    }
};
exports.BrowseSkillsRoutes = BrowseSkillsRoutes;
exports.BrowseSkillsRoutes = BrowseSkillsRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.BrowseSkillsController)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SkillDetailsController)),
    __metadata("design:paramtypes", [BrowseSkillsController_1.BrowseSkillsController,
        SkillDetailsController_1.SkillDetailsController])
], BrowseSkillsRoutes);
//# sourceMappingURL=browseSkillsRoutes.js.map