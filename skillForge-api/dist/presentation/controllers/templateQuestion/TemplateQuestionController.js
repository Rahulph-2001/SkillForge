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
exports.TemplateQuestionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const CreateTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase");
const ListTemplateQuestionsUseCase_1 = require("../../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase");
const UpdateTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase");
const DeleteTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let TemplateQuestionController = class TemplateQuestionController {
    constructor(createTemplateQuestionUseCase, listTemplateQuestionsUseCase, updateTemplateQuestionUseCase, deleteTemplateQuestionUseCase, responseBuilder) {
        this.createTemplateQuestionUseCase = createTemplateQuestionUseCase;
        this.listTemplateQuestionsUseCase = listTemplateQuestionsUseCase;
        this.updateTemplateQuestionUseCase = updateTemplateQuestionUseCase;
        this.deleteTemplateQuestionUseCase = deleteTemplateQuestionUseCase;
        this.responseBuilder = responseBuilder;
    }
    /**
     * POST /api/v1/admin/skill-templates/:templateId/questions
     * Create a new question for a template
     */
    async create(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { templateId } = req.params;
            const dto = { ...req.body, templateId };
            const question = await this.createTemplateQuestionUseCase.execute(adminUserId, dto);
            const response = this.responseBuilder.success(question.toJSON(), 'Question created successfully', HttpStatusCode_1.HttpStatusCode.CREATED);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/admin/skill-templates/:templateId/questions
     * List questions for a template (optionally filtered by level)
     */
    async list(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { templateId } = req.params;
            const { level } = req.query;
            const questions = await this.listTemplateQuestionsUseCase.execute(adminUserId, templateId, level);
            const response = this.responseBuilder.success(questions.map((q) => q.toJSON()), 'Questions retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/admin/skill-templates/:templateId/questions/:id
     * Update a question
     */
    async update(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { id } = req.params;
            const dto = { ...req.body, questionId: id };
            const question = await this.updateTemplateQuestionUseCase.execute(adminUserId, dto);
            const response = this.responseBuilder.success(question.toJSON(), 'Question updated successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/admin/skill-templates/:templateId/questions/:id
     * Delete a question
     */
    async delete(req, res, next) {
        try {
            const adminUserId = req.user.userId;
            const { id } = req.params;
            await this.deleteTemplateQuestionUseCase.execute(adminUserId, id);
            const response = this.responseBuilder.success({ message: 'Question deleted successfully' }, 'Question deleted successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.TemplateQuestionController = TemplateQuestionController;
exports.TemplateQuestionController = TemplateQuestionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CreateTemplateQuestionUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ListTemplateQuestionsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UpdateTemplateQuestionUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.DeleteTemplateQuestionUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [CreateTemplateQuestionUseCase_1.CreateTemplateQuestionUseCase,
        ListTemplateQuestionsUseCase_1.ListTemplateQuestionsUseCase,
        UpdateTemplateQuestionUseCase_1.UpdateTemplateQuestionUseCase,
        DeleteTemplateQuestionUseCase_1.DeleteTemplateQuestionUseCase, Object])
], TemplateQuestionController);
//# sourceMappingURL=TemplateQuestionController.js.map