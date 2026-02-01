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
exports.GetInterviewUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
let GetInterviewUseCase = class GetInterviewUseCase {
    constructor(interviewRepository, applicationRepository, projectRepository, mapper) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.mapper = mapper;
    }
    async execute(userId, applicationId) {
        const application = await this.applicationRepository.findById(applicationId);
        if (!application) {
            throw new AppError_1.NotFoundError('Application not found');
        }
        const project = await this.projectRepository.findById(application.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        if (project.clientId !== userId && application.applicantId !== userId) {
            throw new AppError_1.ForbiddenError('You are not authorized to view interviews for this application');
        }
        const interviews = await this.interviewRepository.findByApplicationId(applicationId);
        return interviews.map(i => this.mapper.toResponseDTO(i));
    }
};
exports.GetInterviewUseCase = GetInterviewUseCase;
exports.GetInterviewUseCase = GetInterviewUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IInterviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IInterviewMapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetInterviewUseCase);
//# sourceMappingURL=GetInterviewUseCase.js.map