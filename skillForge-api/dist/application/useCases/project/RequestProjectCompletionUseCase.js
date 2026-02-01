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
exports.RequestProjectCompletionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Project_1 = require("../../../domain/entities/Project");
let RequestProjectCompletionUseCase = class RequestProjectCompletionUseCase {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async execute(projectId, userId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        // Verify user is the accepted contributor
        if (project.acceptedContributor?.id !== userId) {
            throw new AppError_1.ForbiddenError('Only the assigned contributor can mark this project as completed');
        }
        // Verify status
        if (project.status !== Project_1.ProjectStatus.IN_PROGRESS) {
            throw new AppError_1.ValidationError('Project must be In Progress to mark as completed');
        }
        // Update status
        await this.projectRepository.updateStatus(projectId, Project_1.ProjectStatus.PENDING_COMPLETION);
    }
};
exports.RequestProjectCompletionUseCase = RequestProjectCompletionUseCase;
exports.RequestProjectCompletionUseCase = RequestProjectCompletionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __metadata("design:paramtypes", [Object])
], RequestProjectCompletionUseCase);
//# sourceMappingURL=RequestProjectCompletionUseCase.js.map