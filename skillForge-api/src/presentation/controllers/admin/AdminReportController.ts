import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../../infrastructure/di/types";
import { IAdminListReportsUseCase } from "../../../application/useCases/admin/interfaces/IAdminListReportsUseCase";
import { IAdminManageReportUseCase } from "../../../application/useCases/admin/interfaces/IAdminManageReportUseCase";
import { IPaginationService } from "../../../domain/services/IPaginationService";
import { ReportStatus, ReportType } from "../../../domain/entities/Report";

@injectable()
export class AdminReportController {
    constructor(
        @inject(TYPES.IAdminListReportsUseCase) private listReportsUseCase: IAdminListReportsUseCase,
        @inject(TYPES.IAdminManageReportUseCase) private manageReportUseCase: IAdminManageReportUseCase,
        @inject(TYPES.IPaginationService) private paginationService: IPaginationService
    ) { }

    async listReports(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as ReportStatus | undefined;
            const type = req.query.type as ReportType | undefined;
            const projectId = req.query.projectId as string | undefined;

            const paginationParams = this.paginationService.validatePaginationParams(page, limit);
            const result = await this.listReportsUseCase.execute(paginationParams.page, paginationParams.limit, { status, type, projectId });
            
            const paginationResult = this.paginationService.createResult(
                result.reports,
                result.total,
                paginationParams.page,
                paginationParams.limit
            );

            res.json(paginationResult);
        } catch (error) {
            next(error);
        }
    }

    async manageReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { reportId } = req.params;
            const { action, resolution } = req.body;
            const adminId = (req as any).user?.id;

            await this.manageReportUseCase.execute(reportId, adminId, action, resolution);
            res.json({ message: "Report updated successfully" });
        } catch (error) {
            next(error);
        }
    }
}