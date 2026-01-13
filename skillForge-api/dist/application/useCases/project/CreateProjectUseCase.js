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
exports.CreateProjectUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Project_1 = require("../../../domain/entities/Project");
const AppError_1 = require("../../../domain/errors/AppError");
const uuid_1 = require("uuid");
let CreateProjectUseCase = class CreateProjectUseCase {
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async execute(userId, request, paymentId) {
        // 1. Verify user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        // 2. Create project entity
        const project = Project_1.Project.create({
            id: (0, uuid_1.v4)(),
            clientId: userId,
            title: request.title,
            description: request.description,
            category: request.category,
            tags: request.tags || [],
            budget: request.budget,
            duration: request.duration,
            deadline: request.deadline || null,
            status: Project_1.ProjectStatus.OPEN,
            paymentId: paymentId || null,
            applicationsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // 3. Save project
        const savedProject = await this.projectRepository.create(project);
        // 4. Map to response DTO
        return {
            id: savedProject.id,
            clientId: savedProject.clientId,
            title: savedProject.title,
            description: savedProject.description,
            category: savedProject.category,
            tags: savedProject.tags,
            budget: savedProject.budget,
            duration: savedProject.duration,
            deadline: savedProject.deadline || undefined,
            status: savedProject.status,
            paymentId: savedProject.paymentId || undefined,
            applicationsCount: savedProject.applicationsCount,
            createdAt: savedProject.createdAt,
            updatedAt: savedProject.updatedAt,
            client: {
                name: user.name,
                avatar: user.avatarUrl || undefined,
                rating: user.rating || undefined,
                isVerified: user.verification?.email_verified || false,
            },
        };
    }
};
exports.CreateProjectUseCase = CreateProjectUseCase;
exports.CreateProjectUseCase = CreateProjectUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CreateProjectUseCase);
//# sourceMappingURL=CreateProjectUseCase.js.map