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
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let SkillTemplateController = class SkillTemplateController {
    constructor(createSkillTemplateUseCase, listSkillTemplatesUseCase, getSkillTemplateByIdUseCase, updateSkillTemplateUseCase, toggleSkillTemplateStatusUseCase, responseBuilder) {
        this.createSkillTemplateUseCase = createSkillTemplateUseCase;
        this.listSkillTemplatesUseCase = listSkillTemplatesUseCase;
        this.getSkillTemplateByIdUseCase = getSkillTemplateByIdUseCase;
        this.updateSkillTemplateUseCase = updateSkillTemplateUseCase;
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
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limits) : 10;
            const search = req.query.search;
            const category = req.query.category;
            const status = req.query.status;
            const result = await this.listSkillTemplatesUseCase.execute(adminUserId, page, limit, search, category, status);
            const resposne = this.responseBuilder.success(result, 'Skill templates retrieves successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(resposne.statusCode).json(resposne.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/skill-templates/:id
     * Get a single skill template by ID
     */
    async getById(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const templateId = req.params.id;
            const template = await this.getSkillTemplateByIdUseCase.execute(adminUserId, templateId);
            const response = this.responseBuilder.success(template.toJSON(), 'Skill template retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
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
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateSkillTemplateUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IListSkillTemplatesUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetSkillTemplateByIdUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUpdateSkillTemplateUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IToggleSkillTemplateStatusUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], SkillTemplateController);
//# sourceMappingURL=SkillTemplateController.js.map