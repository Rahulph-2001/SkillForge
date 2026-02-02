import { injectable, inject } from "inversify";
import { PrismaClient, Report as PrismaReport, Prisma } from "@prisma/client";
import { TYPES } from "../../di/types";
import { IReportRepository, CreateReportDTO, ReportFilters } from "../../../domain/repositories/IReportRepository";
import { Report, ReportProps, ReportStatus, ReportType } from "../../../domain/entities/Report";

@injectable()
export class PrismaReportRepository implements IReportRepository {
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) { }

    async create(data: CreateReportDTO): Promise<Report> {
        const created = await this.prisma.report.create({
            data: {
                reporterId: data.reporterId,
                type: data.type as any,
                category: data.category,
                description: data.description,
                status: ReportStatus.PENDING as any,
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

    async findById(id: string): Promise<Report | null> {
        const found = await this.prisma.report.findUnique({
            where: { id },
            include: {
                reporter: true,
                project: true
            }
        });
        return found ? this.toDomain(found) : null;
    }

    async findAll(page: number, limit: number, filters?: ReportFilters): Promise<{ reports: Report[]; total: number }> {
        const where: Prisma.ReportWhereInput = {};

        if (filters?.status) {
            where.status = filters.status as any;
        }
        if (filters?.type) {
            where.type = filters.type as any;
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

    async update(report: Report): Promise<void> {
        if (!report.id) throw new Error("Report ID required for update");

        await this.prisma.report.update({
            where: { id: report.id },
            data: {
                status: report.props.status as any,
                resolution: report.props.resolution,
                resolvedBy: report.props.resolvedBy,
                resolvedAt: report.props.resolvedAt
            }
        });
    }

    async count(filters?: ReportFilters): Promise<number> {
        const where: Prisma.ReportWhereInput = {};
        if (filters?.status) where.status = filters.status as any;
        return this.prisma.report.count({ where });
    }

    private toDomain(prismaReport: any): Report {
        return Report.create({
            id: prismaReport.id,
            reporterId: prismaReport.reporterId,
            type: prismaReport.type as ReportType,
            category: prismaReport.category,
            description: prismaReport.description,
            status: prismaReport.status as ReportStatus,
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
}
