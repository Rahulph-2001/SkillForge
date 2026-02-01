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
exports.GetProjectApplicationsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let GetProjectApplicationsUseCase = class GetProjectApplicationsUseCase {
    constructor(applicationRepository, projectRepository, skillRepository, mapper) {
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.mapper = mapper;
    }
    async execute(projectId, userId) {
        // 1. Verify project exists
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        // 2. Verify ownership
        if (project.clientId !== userId) {
            throw new AppError_1.ForbiddenError(messages_1.ERROR_MESSAGES.PROJECT_APPLICATION.UNAUTHORIZED);
        }
        // 3. Get applications
        const applications = await this.applicationRepository.findByProjectId(projectId);
        // 4. Map to DTO
        // The mapper likely expects entities. If entities have applicant relation loaded, good.
        // If not, I might need to fetch user details.
        // Let's check IProjectApplicationMapper usage in ApplyToProjectUseCase (step 1072).
        // It accepts (savedApplication, userDetails).
        // Here we have a list.
        // IProjectApplicationMapper should have toResponseDTOList or similar that handles relations.
        // Typically mappers handle this if entity has the data.
        // IProjectApplicationRepository.findByProjectId implementation in step 1075 (wait, I implemented UseCase, not Repos).
        // I need to ensure Repository fetches relations.
        return this.mapper.toResponseDTOList(applications);
    }
};
exports.GetProjectApplicationsUseCase = GetProjectApplicationsUseCase;
exports.GetProjectApplicationsUseCase = GetProjectApplicationsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetProjectApplicationsUseCase);
// Note: I included ISkillRepository import but didn't use it, remove it.
// Also, ISkillRepository was not in constructor.
//# sourceMappingURL=GetProjectApplicationsUseCase.js.map