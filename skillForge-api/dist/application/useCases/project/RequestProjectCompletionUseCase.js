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
const ProjectApplication_1 = require("../../../domain/entities/ProjectApplication");
const Notification_1 = require("../../../domain/entities/Notification");
let RequestProjectCompletionUseCase = class RequestProjectCompletionUseCase {
    constructor(projectRepository, applicationRepository, userRepository, notificationService) {
        this.projectRepository = projectRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    async execute(projectId, userId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        // Verify user is an approved applicant
        const application = await this.applicationRepository.findByProjectAndApplicant(projectId, userId);
        if (!application || application.status !== ProjectApplication_1.ProjectApplicationStatus.ACCEPTED) {
            throw new AppError_1.ForbiddenError('Only accepted contributors can request completion');
        }
        if (project.status !== Project_1.ProjectStatus.IN_PROGRESS) {
            throw new AppError_1.ValidationError('Project must be In Progress to request completion');
        }
        project.markAsPendingCompletion();
        await this.projectRepository.update(project);
        // Notify project owner about completion request
        const contributor = await this.userRepository.findById(userId);
        await this.notificationService.send({
            userId: project.clientId,
            type: Notification_1.NotificationType.PROJECT_COMPLETION_REQUESTED,
            title: 'Project Completion Requested',
            message: `${contributor?.name || 'Contributor'} marked "${project.title}" as completed and is requesting your approval`,
            data: {
                projectId: project.id,
                contributorId: userId
            },
        });
    }
};
exports.RequestProjectCompletionUseCase = RequestProjectCompletionUseCase;
exports.RequestProjectCompletionUseCase = RequestProjectCompletionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RequestProjectCompletionUseCase);
//# sourceMappingURL=RequestProjectCompletionUseCase.js.map