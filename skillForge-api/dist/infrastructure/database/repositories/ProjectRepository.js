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
    // --- Helper: Mappers ---
    mapToPrismaStatus(status) {
        switch (status) {
            case Project_1.ProjectStatus.OPEN:
                return 'Open';
            case Project_1.ProjectStatus.IN_PROGRESS:
                return 'In_Progress';
            case Project_1.ProjectStatus.PENDING_COMPLETION:
                return 'Pending_Completion';
            case Project_1.ProjectStatus.PAYMENT_PENDING:
                return 'Payment_Pending';
            case Project_1.ProjectStatus.REFUND_PENDING:
                return 'Refund_Pending';
            case Project_1.ProjectStatus.COMPLETED:
                return 'Completed';
            case Project_1.ProjectStatus.CANCELLED:
                return 'Cancelled';
            default:
                return 'Open';
        }
    }
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
            case 'Pending_Completion':
                status = Project_1.ProjectStatus.PENDING_COMPLETION;
                break;
            case 'Payment_Pending':
                status = Project_1.ProjectStatus.PAYMENT_PENDING;
                break;
            case 'Refund_Pending':
                status = Project_1.ProjectStatus.REFUND_PENDING;
                break;
            default:
                status = Project_1.ProjectStatus.OPEN; // Default fallback
        }
        // Find accepted applicant if present
        const acceptedApp = data.applications?.find((app) => app.status === 'ACCEPTED');
        const acceptedContributor = acceptedApp?.applicant ? {
            id: acceptedApp.applicant.id,
            name: acceptedApp.applicant.name,
            avatarUrl: acceptedApp.applicant.avatarUrl
        } : undefined;
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
            client: data.client ? {
                id: data.client.id,
                name: data.client.name,
                avatarUrl: data.client.avatarUrl
            } : undefined,
            acceptedContributor,
        });
    }
    // --- Read Operations ---
    async findById(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId, isDeleted: false },
            include: {
                applications: {
                    where: { status: 'ACCEPTED' },
                    include: { applicant: true }
                }
            }
        });
        return project ? this.mapToDomain(project) : null;
    }
    async findByClientId(clientId) {
        const projects = await this.prisma.project.findMany({
            where: { clientId, isDeleted: false },
            include: {
                applications: {
                    where: { status: 'ACCEPTED' },
                    include: { applicant: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return projects.map((p) => this.mapToDomain(p));
    }
    async findByClientIdAndStatus(clientId, status) {
        const prismaStatus = this.mapToPrismaStatus(status);
        const projects = await this.prisma.project.findMany({
            where: { clientId, status: prismaStatus, isDeleted: false },
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
    async findContributingProjects(userId) {
        const applications = await this.prisma.projectApplication.findMany({
            where: {
                applicantId: userId,
                status: 'ACCEPTED',
            },
            include: {
                project: {
                    include: {
                        client: true,
                    }
                },
            },
        });
        const projects = applications
            .map((app) => app.project)
            .filter((project) => project !== null && (project.status === 'In_Progress' ||
            project.status === 'Open' ||
            project.status === 'Pending_Completion' ||
            project.status === 'Payment_Pending' ||
            project.status === 'Refund_Pending'));
        return projects.map((p) => this.mapToDomain(p));
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
            where.status = this.mapToPrismaStatus(filters.status);
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
        const prismaStatus = this.mapToPrismaStatus(project.status);
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
        const prismaStatus = this.mapToPrismaStatus(project.status);
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
        const prismaStatus = this.mapToPrismaStatus(status);
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
    // --- Admin Operations ---
    async findAllAdmin(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
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
            where.status = this.mapToPrismaStatus(filters.status);
        }
        // Get total count
        const total = await this.prisma.project.count({ where });
        // Get projects with relations
        const projects = await this.prisma.project.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    }
                },
                applications: {
                    where: { status: 'ACCEPTED' },
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 1
                }
            }
        });
        return {
            projects: projects.map((p) => this.mapToDomain(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getStats() {
        const [totalProjects, openProjects, inProgressProjects, completedProjects, paymentPending, refundPending, cancelledProjects, budgetSum] = await Promise.all([
            this.prisma.project.count({ where: { isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'Open', isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'In_Progress', isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'Completed', isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'Payment_Pending', isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'Refund_Pending', isDeleted: false } }),
            this.prisma.project.count({ where: { status: 'Cancelled', isDeleted: false } }),
            this.prisma.project.aggregate({
                where: { isDeleted: false },
                _sum: { budget: true }
            })
        ]);
        return {
            totalProjects,
            openProjects,
            inProgressProjects,
            completedProjects,
            pendingApprovalProjects: paymentPending + refundPending,
            cancelledProjects,
            totalBudget: Number(budgetSum._sum.budget || 0)
        };
    }
};
exports.ProjectRepository = ProjectRepository;
exports.ProjectRepository = ProjectRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], ProjectRepository);
//# sourceMappingURL=ProjectRepository.js.map