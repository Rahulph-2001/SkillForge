import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { IReportRepository, ReportFilters } from "../../../domain/repositories/IReportRepository";
import { Report } from "../../../domain/entities/Report";
import { IAdminListReportsUseCase } from "./interfaces/IAdminListReportsUseCase";

@injectable()
export class AdminListReportsUseCase implements IAdminListReportsUseCase {
    constructor(
        @inject(TYPES.IReportRepository) private reportRepository: IReportRepository
    ) { }

    async execute(page: number, limit: number, filters?: ReportFilters): Promise<{ reports: Report[]; total: number }> {
        return this.reportRepository.findAll(page, limit, filters);
    }
}
