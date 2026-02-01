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
exports.RejectProjectCompletionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Project_1 = require("../../../domain/entities/Project");
let RejectProjectCompletionUseCase = class RejectProjectCompletionUseCase {
    constructor(projectRepository
    // Inject Payment/Escrow service if refund logic is needed immediately
    ) {
        this.projectRepository = projectRepository;
    }
    async execute(projectId, clientId) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        if (project.clientId !== clientId) {
            throw new AppError_1.ForbiddenError('Only the project client can reject completion');
        }
        if (project.status !== Project_1.ProjectStatus.PENDING_COMPLETION) {
            throw new AppError_1.ValidationError('Project is not pending completion');
        }
        // Rejecting moves it back to IN_PROGRESS (Request Modifications) or CANCELLED?
        // User requested "Reject and Refund", so CANCELLED.
        await this.projectRepository.updateStatus(projectId, Project_1.ProjectStatus.CANCELLED);
        // TODO: Trigger Refund Logic
    }
};
exports.RejectProjectCompletionUseCase = RejectProjectCompletionUseCase;
exports.RejectProjectCompletionUseCase = RejectProjectCompletionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __metadata("design:paramtypes", [Object])
], RejectProjectCompletionUseCase);
//# sourceMappingURL=RejectProjectCompletionUseCase.js.map