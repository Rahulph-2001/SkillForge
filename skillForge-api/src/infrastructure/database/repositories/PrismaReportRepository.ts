import { injectable, inject } from "inversify";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient, Report as PrismaReport, Prisma } from "@prisma/client";
import { TYPES } from "../../di/types";
import { IReportRepository, CreateReportDTO, ReportFilters } from "../../../domain/repositories/IReportRepository";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Report, ReportProps, ReportStatus, ReportType } from "../../../domain/entities/Report";

@injectable()
export class PrismaReportRepository implements IReportRepository {
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) { }

    async create(data: CreateReportDTO): Promise<Report> {
        const created = await this.prisma.report.create({
            data: {
                reporterId: data.reporterId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: data.type as any,
                category: data.category,
                description: data.description,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            where.status = filters.status as any;
        }
        if (filters?.type) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                status: report.props.status as any,
                resolution: report.props.resolution,
                resolvedBy: report.props.resolvedBy,
                resolvedAt: report.props.resolvedAt
            }
        });
    }

    async count(filters?: ReportFilters): Promise<number> {
        const where: Prisma.ReportWhereInput = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (filters?.status) where.status = filters.status as any;
        return this.prisma.report.count({ where });
    }

    async findPendingReports(limit: number): Promise<Report[]> {
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
        })

        return reports.map(r=> this.toDomain(r))
    }

    async countPending(): Promise<number> {
        return this.prisma.report.count({
            where: {
                status:"PENDING"
            }
        })
    }

    private toDomain(prismaReport: Record<string, unknown>): Report {
        return Report.create({
            id: (prismaReport.id || prismaReport._id) as string | undefined,
            reporterId: prismaReport.reporterId as string,
            type: prismaReport.type as ReportType,
            category: prismaReport.category as string,
            description: prismaReport.description as string,
            status: prismaReport.status as ReportStatus,
            targetUserId: prismaReport.targetUserId as string | null | undefined,
            projectId: prismaReport.projectId as string | null | undefined,
            resolution: prismaReport.resolution as string | null | undefined,
            resolvedBy: prismaReport.resolvedBy as string | null | undefined,
            resolvedAt: prismaReport.resolvedAt as Date | null | undefined,
            createdAt: prismaReport.createdAt as Date,
            updatedAt: prismaReport.updatedAt as Date,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reporter: (prismaReport.reporter as any) ? {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                id: (prismaReport.reporter as any).id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name: (prismaReport.reporter as any).name,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                email: (prismaReport.reporter as any).email,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                avatarUrl: (prismaReport.reporter as any).avatarUrl
            } : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project: (prismaReport.project as any) ? {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                id: (prismaReport.project as any).id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                title: (prismaReport.project as any).title
            } : undefined
        });
    }
}
