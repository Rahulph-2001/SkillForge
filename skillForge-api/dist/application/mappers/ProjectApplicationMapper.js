"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectApplicationMapper = void 0;
const inversify_1 = require("inversify");
let ProjectApplicationMapper = class ProjectApplicationMapper {
    toResponseDTO(application, applicant) {
        return {
            id: application.id,
            projectId: application.projectId,
            applicantId: application.applicantId,
            coverLetter: application.coverLetter,
            proposedBudget: application.proposedBudget,
            proposedDuration: application.proposedDuration,
            status: application.status,
            matchScore: application.matchScore,
            matchAnalysis: application.matchAnalysis,
            applicant: applicant ? {
                id: applicant.id,
                name: applicant.name,
                avatarUrl: applicant.avatarUrl,
                rating: applicant.rating,
                reviewCount: applicant.reviewCount,
                skillsOffered: applicant.skillsOffered,
            } : undefined,
            project: application.project ? {
                id: application.project.id,
                title: application.project.title,
                budget: application.project.budget,
                duration: application.project.duration,
            } : undefined,
            interviews: application.interviews ? application.interviews.map(i => ({
                id: i.id,
                scheduledAt: i.scheduledAt,
                durationMinutes: i.durationMinutes,
                status: i.status,
                videoCallRoomId: i.videoCallRoom?.id,
            })) : [],
            appliedAt: application.createdAt,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            reviewedAt: application.reviewedAt,
        };
    }
    toResponseDTOList(applications, applicantsMap) {
        return applications.map(app => this.toResponseDTO(app, applicantsMap?.get(app.applicantId)));
    }
};
exports.ProjectApplicationMapper = ProjectApplicationMapper;
exports.ProjectApplicationMapper = ProjectApplicationMapper = __decorate([
    (0, inversify_1.injectable)()
], ProjectApplicationMapper);
//# sourceMappingURL=ProjectApplicationMapper.js.map