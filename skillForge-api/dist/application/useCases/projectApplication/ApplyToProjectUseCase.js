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
exports.ApplyToProjectUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const ProjectApplication_1 = require("../../../domain/entities/ProjectApplication");
const Project_1 = require("../../../domain/entities/Project");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
const Notification_1 = require("../../../domain/entities/Notification");
let ApplyToProjectUseCase = class ApplyToProjectUseCase {
    constructor(applicationRepository, projectRepository, userRepository, skillRepository, geminiService, mapper, notificationService) {
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.geminiService = geminiService;
        this.mapper = mapper;
        this.notificationService = notificationService;
    }
    async execute(applicantId, dto) {
        // 1. Validate project exists and is open
        const project = await this.projectRepository.findById(dto.projectId);
        if (!project) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }
        if (project.status !== Project_1.ProjectStatus.OPEN) {
            throw new AppError_1.ValidationError('Project is not accepting applications');
        }
        if (project.clientId === applicantId) {
            throw new AppError_1.ForbiddenError('Cannot apply to your own project');
        }
        // 2. Check for existing application
        const existingApplication = await this.applicationRepository.findByProjectAndApplicant(dto.projectId, applicantId);
        if (existingApplication) {
            throw new AppError_1.ValidationError('You have already applied to this project');
        }
        // 3. Get applicant profile for AI analysis
        const applicant = await this.userRepository.findById(applicantId);
        if (!applicant) {
            throw new AppError_1.NotFoundError('Applicant not found');
        }
        // 4. Get applicant's skills
        const skills = await this.skillRepository.findByProviderId(applicantId);
        const approvedSkills = skills.filter(s => s.status === 'approved' &&
            s.verificationStatus === 'passed' &&
            !s.isBlocked &&
            !s.isAdminBlocked);
        // 5. Prepare data for AI analysis
        const applicantProfile = {
            id: applicant.id,
            name: applicant.name,
            bio: applicant.bio,
            skills: approvedSkills.map(s => s.title),
            rating: applicant.rating,
            reviewCount: applicant.reviewCount,
            totalSessionsCompleted: applicant.totalSessionsCompleted,
            skillDetails: approvedSkills.map(s => ({
                title: s.title,
                category: s.category,
                level: s.level,
                rating: s.rating,
                totalSessions: s.totalSessions,
            })),
        };
        const projectDetails = {
            id: project.id,
            title: project.title,
            description: project.description,
            category: project.category,
            tags: project.tags,
            budget: Number(project.budget),
            duration: project.duration,
        };
        // 6. Run AI match analysis
        const matchAnalysis = await this.geminiService.analyzeApplicantMatch(projectDetails, applicantProfile, dto.coverLetter);
        // 7. Create application entity
        const application = new ProjectApplication_1.ProjectApplication({
            projectId: dto.projectId,
            applicantId,
            coverLetter: dto.coverLetter,
            proposedBudget: dto.proposedBudget,
            proposedDuration: dto.proposedDuration,
        });
        // 8. Set match score from AI analysis
        application.setMatchScore(matchAnalysis.overallScore, matchAnalysis);
        // 9. Save application
        const savedApplication = await this.applicationRepository.create(application);
        // 10. Increment project applications count
        await this.projectRepository.incrementApplicationsCount(dto.projectId);
        // 11. Notify project owner about new application
        await this.notificationService.send({
            userId: project.clientId,
            type: Notification_1.NotificationType.PROJECT_APPLICATION_RECEIVED,
            title: 'New Project Application',
            message: `${applicant.name} applied to your project "${project.title}"`,
            data: {
                projectId: project.id,
                applicationId: savedApplication.id,
                applicantId: applicantId,
                matchScore: matchAnalysis.overallScore
            },
        });
        // 12. Return response
        return this.mapper.toResponseDTO(savedApplication, {
            id: applicant.id,
            name: applicant.name,
            avatarUrl: applicant.avatarUrl,
            rating: applicant.rating,
            reviewCount: applicant.reviewCount,
            skillsOffered: approvedSkills.map(s => s.title),
        });
    }
};
exports.ApplyToProjectUseCase = ApplyToProjectUseCase;
exports.ApplyToProjectUseCase = ApplyToProjectUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IProjectRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IGeminiAIService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IProjectApplicationMapper)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ApplyToProjectUseCase);
//# sourceMappingURL=ApplyToProjectUseCase.js.map