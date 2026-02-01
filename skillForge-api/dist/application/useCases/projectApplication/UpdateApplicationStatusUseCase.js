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
exports.UpdateApplicationStatusUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProjectApplication_1 = require("../../../domain/entities/ProjectApplication");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let UpdateApplicationStatusUseCase = class UpdateApplicationStatusUseCase {
    constructor(applicationRepository, projectRepository, mapper) {
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.mapper = mapper;
    }
    async execute(applicationId, clientId, status) {
        // 1. Get application
        const application = await this.applicationRepository.findById(applicationId);
        if (!application) {
            throw new AppError_1.NotFoundError('Application not found');
        }
        // 2. Validate project ownership
        const project = await this.projectRepository.findById(application.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        if (project.clientId !== clientId) {
            throw new AppError_1.ForbiddenError('Only the project owner can update application status');
        }
        // 3. Apply status change based on domain logic
        switch (status) {
            case ProjectApplication_1.ProjectApplicationStatus.SHORTLISTED:
                application.shortlist();
                break;
            case ProjectApplication_1.ProjectApplicationStatus.ACCEPTED:
                application.accept();
                // Automatically start the project if it's open
                if (project.status === 'Open') {
                    try {
                        project.markAsInProgress();
                        await this.projectRepository.update(project);
                    }
                    catch (error) {
                        console.warn(`[UpdateApplicationStatus] Could not mark project as in-progress: ${error}`);
                    }
                }
                break;
            case ProjectApplication_1.ProjectApplicationStatus.REJECTED:
                application.reject();
                break;
            default:
                throw new AppError_1.ValidationError('Invalid status update');
        }
        // 4. Save and return
        const updated = await this.applicationRepository.update(application);
        return this.mapper.toResponseDTO(updated);
    }
};
exports.UpdateApplicationStatusUseCase = UpdateApplicationStatusUseCase;
exports.UpdateApplicationStatusUseCase = UpdateApplicationStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateApplicationStatusUseCase);
//# sourceMappingURL=UpdateApplicationStatusUseCase.js.map