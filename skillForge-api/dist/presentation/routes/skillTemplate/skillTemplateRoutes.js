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
exports.SkillTemplateRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const SkillTemplateController_1 = require("../../controllers/skillTemplate/SkillTemplateController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let SkillTemplateRoutes = class SkillTemplateRoutes {
    constructor(skillTemplateController) {
        this.skillTemplateController = skillTemplateController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // All routes require admin authentication
        this.router.use(authMiddleware_1.authMiddleware);
        // POST /api/v1/admin/skill-templates - Create new template
        this.router.post('/', this.skillTemplateController.create.bind(this.skillTemplateController));
        // GET /api/v1/admin/skill-templates - List all templates
        this.router.get('/', this.skillTemplateController.list.bind(this.skillTemplateController));
        // PUT /api/v1/admin/skill-templates/:id - Update template
        this.router.put('/:id', this.skillTemplateController.update.bind(this.skillTemplateController));
        // DELETE /api/v1/admin/skill-templates/:id - Delete template
        this.router.delete('/:id', this.skillTemplateController.delete.bind(this.skillTemplateController));
        // PATCH /api/v1/admin/skill-templates/:id/toggle-status - Toggle status
        this.router.patch('/:id/toggle-status', this.skillTemplateController.toggleStatus.bind(this.skillTemplateController));
    }
};
exports.SkillTemplateRoutes = SkillTemplateRoutes;
exports.SkillTemplateRoutes = SkillTemplateRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SkillTemplateController)),
    __metadata("design:paramtypes", [SkillTemplateController_1.SkillTemplateController])
], SkillTemplateRoutes);
//# sourceMappingURL=skillTemplateRoutes.js.map