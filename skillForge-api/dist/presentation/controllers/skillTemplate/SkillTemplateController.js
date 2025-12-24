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
exports.SkillTemplateController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const CreateSkillTemplateUseCase_1 = require("../../../application/useCases/skillTemplate/CreateSkillTemplateUseCase");
const ListSkillTemplatesUseCase_1 = require("../../../application/useCases/skillTemplate/ListSkillTemplatesUseCase");
const UpdateSkillTemplateUseCase_1 = require("../../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase");
const DeleteSkillTemplateUseCase_1 = require("../../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase");
const ToggleSkillTemplateStatusUseCase_1 = require("../../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
let SkillTemplateController = class SkillTemplateController {
    constructor(createSkillTemplateUseCase, listSkillTemplatesUseCase, updateSkillTemplateUseCase, deleteSkillTemplateUseCase, toggleSkillTemplateStatusUseCase, responseBuilder) {
        this.createSkillTemplateUseCase = createSkillTemplateUseCase;
        this.listSkillTemplatesUseCase = listSkillTemplatesUseCase;
        this.updateSkillTemplateUseCase = updateSkillTemplateUseCase;
        this.deleteSkillTemplateUseCase = deleteSkillTemplateUseCase;
        this.toggleSkillTemplateStatusUseCase = toggleSkillTemplateStatusUseCase;
        this.responseBuilder = responseBuilder;
    }
    /**
     * POST /api/v1/admin/skill-templates
     * Create a new skill template
     */
    async create(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const dto = req.body;
            const template = await this.createSkillTemplateUseCase.execute(adminUserId, dto);
            const response = this.responseBuilder.success(template.toJSON(), 'Skill template created successfully', HttpStatusCode_1.HttpStatusCode.CREATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/skill-templates
     * List all skill templates
     */
    async list(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const templates = await this.listSkillTemplatesUseCase.execute(adminUserId);
            const response = this.responseBuilder.success(templates.map(t => t.toJSON()), 'Skill templates retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/admin/skill-templates/:id
     * Update a skill template
     */
    async update(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const templateId = req.params.id;
            const dto = req.body;
            const template = await this.updateSkillTemplateUseCase.execute(adminUserId, templateId, dto);
            const response = this.responseBuilder.success(template.toJSON(), 'Skill template updated successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/admin/skill-templates/:id
     * Delete (soft delete) a skill template
     */
    async delete(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const templateId = req.params.id;
            await this.deleteSkillTemplateUseCase.execute(adminUserId, templateId);
            const response = this.responseBuilder.success({ message: messages_1.SUCCESS_MESSAGES.TEMPLATE.SKILL_DELETED }, messages_1.SUCCESS_MESSAGES.TEMPLATE.SKILL_DELETED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PATCH /api/v1/admin/skill-templates/:id/toggle-status
     * Toggle skill template status (Active/Inactive)
     */
    async toggleStatus(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const templateId = req.params.id;
            const template = await this.toggleSkillTemplateStatusUseCase.execute(adminUserId, templateId);
            const response = this.responseBuilder.success(template.toJSON(), 'Skill template status toggled successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/skill-templates/active
     * List all active skill templates (public endpoint for users)
     */
    async listActive(_req, res, next) {
        try {
            const templates = await this.listSkillTemplatesUseCase.executePublic();
            const response = this.responseBuilder.success(templates.map((t) => t.toJSON()), 'Active skill templates retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.SkillTemplateController = SkillTemplateController;
exports.SkillTemplateController = SkillTemplateController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CreateSkillTemplateUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ListSkillTemplatesUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UpdateSkillTemplateUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.DeleteSkillTemplateUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ToggleSkillTemplateStatusUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [CreateSkillTemplateUseCase_1.CreateSkillTemplateUseCase,
        ListSkillTemplatesUseCase_1.ListSkillTemplatesUseCase,
        UpdateSkillTemplateUseCase_1.UpdateSkillTemplateUseCase,
        DeleteSkillTemplateUseCase_1.DeleteSkillTemplateUseCase,
        ToggleSkillTemplateStatusUseCase_1.ToggleSkillTemplateStatusUseCase, Object])
], SkillTemplateController);
//# sourceMappingURL=SkillTemplateController.js.map