import { Request, Response, NextFunction } from "express";
import { IAdminListReportsUseCase } from "../../../application/useCases/admin/interfaces/IAdminListReportsUseCase";
import { IAdminManageReportUseCase } from "../../../application/useCases/admin/interfaces/IAdminManageReportUseCase";
import { IPaginationService } from "../../../domain/services/IPaginationService";
export declare class AdminReportController {
    private listReportsUseCase;
    private manageReportUseCase;
    private paginationService;
    constructor(listReportsUseCase: IAdminListReportsUseCase, manageReportUseCase: IAdminManageReportUseCase, paginationService: IPaginationService);
    listReports(req: Request, res: Response, next: NextFunction): Promise<void>;
    manageReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdminReportController.d.ts.map