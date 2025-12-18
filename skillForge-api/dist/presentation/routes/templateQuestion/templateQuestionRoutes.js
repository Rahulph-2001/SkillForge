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
exports.TemplateQuestionRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const TemplateQuestionController_1 = require("../../controllers/templateQuestion/TemplateQuestionController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let TemplateQuestionRoutes = class TemplateQuestionRoutes {
    constructor(templateQuestionController) {
        this.templateQuestionController = templateQuestionController;
        this.router = (0, express_1.Router)({ mergeParams: true });
        this.setupRoutes();
    }
    setupRoutes() {
        // All routes require admin authentication
        this.router.use(authMiddleware_1.authMiddleware);
        // POST /api/v1/admin/skill-templates/:templateId/questions - Create question
        this.router.post('/', this.templateQuestionController.create.bind(this.templateQuestionController));
        // GET /api/v1/admin/skill-templates/:templateId/questions - List questions
        // Supports ?level=Beginner query parameter
        this.router.get('/', this.templateQuestionController.list.bind(this.templateQuestionController));
        // PUT /api/v1/admin/skill-templates/:templateId/questions/:id - Update question
        this.router.put('/:id', this.templateQuestionController.update.bind(this.templateQuestionController));
        // DELETE /api/v1/admin/skill-templates/:templateId/questions/bulk - Bulk delete questions
        this.router.delete('/bulk', this.templateQuestionController.bulkDelete.bind(this.templateQuestionController));
        // DELETE /api/v1/admin/skill-templates/:templateId/questions/:id - Delete question
        this.router.delete('/:id', this.templateQuestionController.delete.bind(this.templateQuestionController));
    }
};
exports.TemplateQuestionRoutes = TemplateQuestionRoutes;
exports.TemplateQuestionRoutes = TemplateQuestionRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TemplateQuestionController)),
    __metadata("design:paramtypes", [TemplateQuestionController_1.TemplateQuestionController])
], TemplateQuestionRoutes);
//# sourceMappingURL=templateQuestionRoutes.js.map