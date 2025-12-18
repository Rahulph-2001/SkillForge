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
exports.BulkDeleteTemplateQuestionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let BulkDeleteTemplateQuestionsUseCase = class BulkDeleteTemplateQuestionsUseCase {
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    async execute(templateId, questionIds) {
        // Validation
        if (!questionIds || questionIds.length === 0) {
            throw new AppError_1.ValidationError('No question IDs provided for deletion');
        }
        if (questionIds.length > 100) {
            throw new AppError_1.ValidationError('Cannot delete more than 100 questions at once');
        }
        // Verify all questions belong to the template
        const questions = await this.questionRepository.findByTemplateId(templateId);
        const templateQuestionIds = new Set(questions.map(q => q.id));
        const invalidIds = questionIds.filter(id => !templateQuestionIds.has(id));
        if (invalidIds.length > 0) {
            throw new AppError_1.NotFoundError(`Some questions do not belong to this template: ${invalidIds.join(', ')}`);
        }
        // Perform bulk delete
        const deletedCount = await this.questionRepository.bulkDelete(questionIds);
        return { deletedCount };
    }
};
exports.BulkDeleteTemplateQuestionsUseCase = BulkDeleteTemplateQuestionsUseCase;
exports.BulkDeleteTemplateQuestionsUseCase = BulkDeleteTemplateQuestionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ITemplateQuestionRepository)),
    __metadata("design:paramtypes", [Object])
], BulkDeleteTemplateQuestionsUseCase);
//# sourceMappingURL=BulkDeleteTemplateQuestionsUseCase.js.map