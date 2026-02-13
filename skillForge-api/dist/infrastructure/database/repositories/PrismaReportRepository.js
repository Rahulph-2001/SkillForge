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
exports.PrismaReportRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
const Report_1 = require("../../../domain/entities/Report");
let PrismaReportRepository = class PrismaReportRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const created = await this.prisma.report.create({
            data: {
                reporterId: data.reporterId,
                type: data.type,
                category: data.category,
                description: data.description,
                status: Report_1.ReportStatus.PENDING,
                targetUserId: data.targetUserId,
                projectId: data.projectId
            },
            include: {
                reporter: true,
                project: true
            }
        });
        return this.toDomain(created);
    }
    async findById(id) {
        const found = await this.prisma.report.findUnique({
            where: { id },
            include: {
                reporter: true,
                project: true
            }
        });
        return found ? this.toDomain(found) : null;
    }
    async findAll(page, limit, filters) {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.projectId) {
            where.projectId = filters.projectId;
        }
        const [items, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reporter: true,
                    project: true
                }
            }),
            this.prisma.report.count({ where })
        ]);
        return {
            reports: items.map(item => this.toDomain(item)),
            total
        };
    }
    async update(report) {
        if (!report.id)
            throw new Error("Report ID required for update");
        await this.prisma.report.update({
            where: { id: report.id },
            data: {
                status: report.props.status,
                resolution: report.props.resolution,
                resolvedBy: report.props.resolvedBy,
                resolvedAt: report.props.resolvedAt
            }
        });
    }
    async count(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        return this.prisma.report.count({ where });
    }
    async findPendingReports(limit) {
        const reports = await this.prisma.report.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                reporter: true
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit
        });
        return reports.map(r => this.toDomain(r));
    }
    async countPending() {
        return this.prisma.report.count({
            where: {
                status: "PENDING"
            }
        });
    }
    toDomain(prismaReport) {
        return Report_1.Report.create({
            id: prismaReport.id,
            reporterId: prismaReport.reporterId,
            type: prismaReport.type,
            category: prismaReport.category,
            description: prismaReport.description,
            status: prismaReport.status,
            targetUserId: prismaReport.targetUserId,
            projectId: prismaReport.projectId,
            resolution: prismaReport.resolution,
            resolvedBy: prismaReport.resolvedBy,
            resolvedAt: prismaReport.resolvedAt,
            createdAt: prismaReport.createdAt,
            updatedAt: prismaReport.updatedAt,
            reporter: prismaReport.reporter ? {
                id: prismaReport.reporter.id,
                name: prismaReport.reporter.name,
                email: prismaReport.reporter.email,
                avatarUrl: prismaReport.reporter.avatarUrl
            } : undefined,
            project: prismaReport.project ? {
                id: prismaReport.project.id,
                title: prismaReport.project.title
            } : undefined
        });
    }
};
exports.PrismaReportRepository = PrismaReportRepository;
exports.PrismaReportRepository = PrismaReportRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaReportRepository);
//# sourceMappingURL=PrismaReportRepository.js.map