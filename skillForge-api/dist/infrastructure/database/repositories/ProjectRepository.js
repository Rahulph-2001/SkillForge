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
exports.ProjectRepository = void 0;
const types_1 = require("../../../infrastructure/di/types");
const inversify_1 = require("inversify");
const Project_1 = require("../../../domain/entities/Project");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
let ProjectRepository = class ProjectRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'project');
    }
    // --- Helper: Mapper ---
    mapToDomain(data) {
        // Map Prisma enum value to ProjectStatus enum
        let status;
        switch (data.status) {
            case 'Open':
                status = Project_1.ProjectStatus.OPEN;
                break;
            case 'In_Progress':
                status = Project_1.ProjectStatus.IN_PROGRESS;
                break;
            case 'Completed':
                status = Project_1.ProjectStatus.COMPLETED;
                break;
            case 'Cancelled':
                status = Project_1.ProjectStatus.CANCELLED;
                break;
            default:
                status = Project_1.ProjectStatus.OPEN; // Default fallback
        }
        return Project_1.Project.create({
            id: data.id,
            clientId: data.clientId,
            title: data.title,
            description: data.description,
            category: data.category,
            tags: data.tags || [],
            budget: Number(data.budget),
            duration: data.duration,
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : null,
            status: status,
            paymentId: data.paymentId,
            applicationsCount: data.applicationsCount || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
    // --- Read Operations ---
    async findById(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId, isDeleted: false },
        });
        return project ? this.mapToDomain(project) : null;
    }
    async findByClientId(clientId) {
        const projects = await this.prisma.project.findMany({
            where: { clientId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
        });
        return projects.map((p) => this.mapToDomain(p));
    }
    async findByClientIdAndStatus(clientId, status) {
        const projects = await this.prisma.project.findMany({
            where: { clientId, status, isDeleted: false },
            orderBy: { createdAt: 'desc' },
        });
        return projects.map((p) => this.mapToDomain(p));
    }
    async findByPaymentId(paymentId) {
        const project = await this.prisma.project.findUnique({
            where: { paymentId, isDeleted: false },
        });
        return project ? this.mapToDomain(project) : null;
    }
    // --- List Operations ---
    async listProjects(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        console.log('[ProjectRepository] Listing projects with filters:', filters);
        // Build where clause
        const where = {
            isDeleted: false,
        };
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { category: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.category) {
            where.category = { contains: filters.category, mode: 'insensitive' };
        }
        if (filters.status) {
            where.status = filters.status;
        }
        // Get total count
        const total = await this.prisma.project.count({ where });
        // Get projects
        const projects = await this.prisma.project.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return {
            projects: projects.map((p) => this.mapToDomain(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // --- Write Operations ---
    async create(project) {
        const data = project.toJSON();
        // Map ProjectStatus enum to Prisma enum value
        let prismaStatus;
        switch (project.status) {
            case Project_1.ProjectStatus.OPEN:
                prismaStatus = 'Open';
                break;
            case Project_1.ProjectStatus.IN_PROGRESS:
                prismaStatus = 'In_Progress';
                break;
            case Project_1.ProjectStatus.COMPLETED:
                prismaStatus = 'Completed';
                break;
            case Project_1.ProjectStatus.CANCELLED:
                prismaStatus = 'Cancelled';
                break;
            default:
                prismaStatus = 'Open';
        }
        const created = await this.prisma.project.create({
            data: {
                id: project.id,
                clientId: project.clientId,
                title: project.title,
                description: project.description,
                category: project.category,
                tags: project.tags,
                budget: project.budget,
                duration: project.duration,
                deadline: project.deadline ? new Date(project.deadline) : null,
                status: prismaStatus,
                paymentId: project.paymentId,
                applicationsCount: project.applicationsCount || 0,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        });
        return this.mapToDomain(created);
    }
    async update(project) {
        // Map ProjectStatus enum to Prisma enum value
        let prismaStatus;
        switch (project.status) {
            case Project_1.ProjectStatus.OPEN:
                prismaStatus = 'Open';
                break;
            case Project_1.ProjectStatus.IN_PROGRESS:
                prismaStatus = 'In_Progress';
                break;
            case Project_1.ProjectStatus.COMPLETED:
                prismaStatus = 'Completed';
                break;
            case Project_1.ProjectStatus.CANCELLED:
                prismaStatus = 'Cancelled';
                break;
            default:
                prismaStatus = 'Open';
        }
        const updated = await this.prisma.project.update({
            where: { id: project.id },
            data: {
                title: project.title,
                description: project.description,
                category: project.category,
                tags: project.tags,
                budget: project.budget,
                duration: project.duration,
                deadline: project.deadline ? new Date(project.deadline) : null,
                status: prismaStatus,
                applicationsCount: project.applicationsCount || 0,
                updatedAt: new Date(),
            },
        });
        return this.mapToDomain(updated);
    }
    async delete(id) {
        await super.delete(id);
    }
    async updateStatus(projectId, status) {
        // Map ProjectStatus enum to Prisma enum value
        let prismaStatus;
        switch (status) {
            case Project_1.ProjectStatus.OPEN:
                prismaStatus = 'Open';
                break;
            case Project_1.ProjectStatus.IN_PROGRESS:
                prismaStatus = 'In_Progress';
                break;
            case Project_1.ProjectStatus.COMPLETED:
                prismaStatus = 'Completed';
                break;
            case Project_1.ProjectStatus.CANCELLED:
                prismaStatus = 'Cancelled';
                break;
            default:
                prismaStatus = 'Open';
        }
        const updated = await this.prisma.project.update({
            where: { id: projectId },
            data: {
                status: prismaStatus,
                updatedAt: new Date(),
            },
        });
        return this.mapToDomain(updated);
    }
    async incrementApplicationsCount(projectId) {
        const updated = await this.prisma.project.update({
            where: { id: projectId },
            data: {
                applicationsCount: { increment: 1 },
                updatedAt: new Date(),
            },
        });
        return this.mapToDomain(updated);
    }
};
exports.ProjectRepository = ProjectRepository;
exports.ProjectRepository = ProjectRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], ProjectRepository);
//# sourceMappingURL=ProjectRepository.js.map