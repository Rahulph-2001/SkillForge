import { ReportFilters } from "../../../../domain/repositories/IReportRepository";
import { Report } from "../../../../domain/entities/Report";

export interface IAdminListReportsUseCase {
    execute(page: number, limit: number, filters?: ReportFilters): Promise<{ reports: Report[]; total: number }>;
}
