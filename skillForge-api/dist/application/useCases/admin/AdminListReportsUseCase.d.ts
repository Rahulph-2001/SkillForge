import { IReportRepository, ReportFilters } from "../../../domain/repositories/IReportRepository";
import { Report } from "../../../domain/entities/Report";
import { IAdminListReportsUseCase } from "./interfaces/IAdminListReportsUseCase";
export declare class AdminListReportsUseCase implements IAdminListReportsUseCase {
    private reportRepository;
    constructor(reportRepository: IReportRepository);
    execute(page: number, limit: number, filters?: ReportFilters): Promise<{
        reports: Report[];
        total: number;
    }>;
}
//# sourceMappingURL=AdminListReportsUseCase.d.ts.map