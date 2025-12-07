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
exports.DeleteTemplateQuestionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
let DeleteTemplateQuestionUseCase = class DeleteTemplateQuestionUseCase {
    constructor(templateQuestionRepository, userRepository) {
        this.templateQuestionRepository = templateQuestionRepository;
        this.userRepository = userRepository;
    }
    async execute(adminUserId, questionId) {
        // Verify admin authorization
        const admin = await this.userRepository.findById(adminUserId);
        if (!admin || admin.role !== UserRole_1.UserRole.ADMIN) {
            throw new AppError_1.UnauthorizedError('Only admins can delete template questions');
        }
        // Check if question exists
        const existingQuestion = await this.templateQuestionRepository.findById(questionId);
        if (!existingQuestion) {
            throw new AppError_1.NotFoundError('Template question not found');
        }
        // Soft delete question
        await this.templateQuestionRepository.delete(questionId);
    }
};
exports.DeleteTemplateQuestionUseCase = DeleteTemplateQuestionUseCase;
exports.DeleteTemplateQuestionUseCase = DeleteTemplateQuestionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ITemplateQuestionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DeleteTemplateQuestionUseCase);
//# sourceMappingURL=DeleteTemplateQuestionUseCase.js.map