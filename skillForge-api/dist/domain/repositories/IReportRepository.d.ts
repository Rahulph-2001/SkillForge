import { Report, ReportStatus, ReportType } from "../entities/Report";
export interface CreateReportDTO {
    reporterId: string;
    type: ReportType;
    category: string;
    description: string;
    targetUserId?: string;
    projectId?: string;
}
export interface ReportFilters {
    status?: ReportStatus;
    type?: ReportType;
    projectId?: string;
}
export interface IReportRepository {
    create(data: CreateReportDTO): Promise<Report>;
    findById(id: string): Promise<Report | null>;
    findAll(page: number, limit: number, filters?: ReportFilters): Promise<{
        reports: Report[];
        total: number;
    }>;
    update(report: Report): Promise<void>;
    count(filters?: ReportFilters): Promise<number>;
}
//# sourceMappingURL=IReportRepository.d.ts.map