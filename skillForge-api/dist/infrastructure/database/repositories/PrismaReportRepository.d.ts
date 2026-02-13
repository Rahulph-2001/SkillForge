import { PrismaClient } from "@prisma/client";
import { IReportRepository, CreateReportDTO, ReportFilters } from "../../../domain/repositories/IReportRepository";
import { Report } from "../../../domain/entities/Report";
export declare class PrismaReportRepository implements IReportRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateReportDTO): Promise<Report>;
    findById(id: string): Promise<Report | null>;
    findAll(page: number, limit: number, filters?: ReportFilters): Promise<{
        reports: Report[];
        total: number;
    }>;
    update(report: Report): Promise<void>;
    count(filters?: ReportFilters): Promise<number>;
    findPendingReports(limit: number): Promise<Report[]>;
    countPending(): Promise<number>;
    private toDomain;
}
//# sourceMappingURL=PrismaReportRepository.d.ts.map