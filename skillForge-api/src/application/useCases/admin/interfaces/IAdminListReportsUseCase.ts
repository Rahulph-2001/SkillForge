import { type ReportFilters } from "../../../../domain/repositories/IReportRepository";
import { type Report } from "../../../../domain/entities/Report";

export interface IAdminListReportsUseCase {
    execute(page: number, limit: number, filters?: ReportFilters): Promise<{ reports: Report[]; total: number }>;
}
