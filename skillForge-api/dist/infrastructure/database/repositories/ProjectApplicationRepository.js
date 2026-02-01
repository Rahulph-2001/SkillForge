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
exports.ProjectApplicationRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
const ProjectApplication_1 = require("../../../domain/entities/ProjectApplication");
let ProjectApplicationRepository = class ProjectApplicationRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'projectApplication');
    }
    async create(application) {
        const prisma = this.prisma;
        const created = await prisma.projectApplication.create({
            data: {
                id: application.id,
                projectId: application.projectId,
                applicantId: application.applicantId,
                coverLetter: application.coverLetter,
                proposedBudget: application.proposedBudget,
                proposedDuration: application.proposedDuration,
                status: application.status,
                matchScore: application.matchScore,
                matchAnalysis: application.matchAnalysis,
                createdAt: application.createdAt,
                updatedAt: application.updatedAt,
                reviewedAt: application.reviewedAt,
            },
        });
        return this.toDomain(created);
    }
    async findById(id) {
        const prisma = this.prisma;
        const data = await prisma.projectApplication.findUnique({
            where: { id },
        });
        return data ? this.toDomain(data) : null;
    }
    async findByProjectId(projectId) {
        const prisma = this.prisma;
        const data = await prisma.projectApplication.findMany({
            where: { projectId },
            orderBy: { matchScore: 'desc' },
        });
        return data.map(d => this.toDomain(d));
    }
    async findByApplicantId(applicantId) {
        const prisma = this.prisma;
        const data = await prisma.projectApplication.findMany({
            where: { applicantId },
            include: {
                project: true,
                interviews: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return data.map(d => this.toDomain(d));
    }
    async findByProjectAndApplicant(projectId, applicantId) {
        const prisma = this.prisma;
        const data = await prisma.projectApplication.findUnique({
            where: {
                projectId_applicantId: { projectId, applicantId },
            },
        });
        return data ? this.toDomain(data) : null;
    }
    async findReceivedApplications(userId) {
        const prisma = this.prisma;
        const data = await prisma.projectApplication.findMany({
            where: {
                project: {
                    clientId: userId,
                },
            },
            include: {
                project: true,
                applicant: true,
                interviews: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return data.map(d => this.toDomain(d));
    }
    async update(application) {
        const prisma = this.prisma;
        const updated = await prisma.projectApplication.update({
            where: { id: application.id },
            data: {
                status: application.status,
                matchScore: application.matchScore,
                matchAnalysis: application.matchAnalysis,
                updatedAt: application.updatedAt,
                reviewedAt: application.reviewedAt,
            },
        });
        return this.toDomain(updated);
    }
    async updateStatus(id, status) {
        const prisma = this.prisma;
        const updated = await prisma.projectApplication.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        const prisma = this.prisma;
        await prisma.projectApplication.delete({ where: { id } });
    }
    toDomain(data) {
        return new ProjectApplication_1.ProjectApplication({
            id: data.id,
            projectId: data.projectId,
            applicantId: data.applicantId,
            coverLetter: data.coverLetter,
            proposedBudget: data.proposedBudget ? Number(data.proposedBudget) : null,
            proposedDuration: data.proposedDuration,
            status: data.status,
            matchScore: data.matchScore ? Number(data.matchScore) : null,
            matchAnalysis: data.matchAnalysis,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            reviewedAt: data.reviewedAt,
            project: data.project,
            applicant: data.applicant,
            interviews: data.interviews,
        });
    }
};
exports.ProjectApplicationRepository = ProjectApplicationRepository;
exports.ProjectApplicationRepository = ProjectApplicationRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], ProjectApplicationRepository);
//# sourceMappingURL=ProjectApplicationRepository.js.map