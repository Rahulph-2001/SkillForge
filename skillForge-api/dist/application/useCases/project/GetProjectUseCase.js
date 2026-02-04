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
exports.GetProjectUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetProjectUseCase = class GetProjectUseCase {
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async execute(projectId) {
        // Fetch project
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError('Project not found');
        }
        // Fetch client details
        const client = await this.userRepository.findById(project.clientId);
        // Map to responses DTO
        return {
            id: project.id,
            clientId: project.clientId,
            title: project.title,
            description: project.description,
            category: project.category,
            tags: project.tags,
            budget: project.budget,
            duration: project.duration,
            deadline: project.deadline || undefined,
            status: project.status,
            paymentId: project.paymentId || undefined,
            applicationsCount: project.applicationsCount,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            client: client ? {
                name: client.name,
                avatar: client.avatarUrl || undefined,
                rating: client.rating || undefined,
                isVerified: client.verification?.email_verified || false,
            } : {
                name: 'Unknown User',
                avatar: undefined,
                rating: undefined,
                isVerified: false,
            },
            acceptedContributor: project.acceptedContributor ? {
                id: project.acceptedContributor.id,
                name: project.acceptedContributor.name,
                avatarUrl: project.acceptedContributor.avatarUrl || undefined,
            } : undefined,
        };
    }
};
exports.GetProjectUseCase = GetProjectUseCase;
exports.GetProjectUseCase = GetProjectUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetProjectUseCase);
//# sourceMappingURL=GetProjectUseCase.js.map