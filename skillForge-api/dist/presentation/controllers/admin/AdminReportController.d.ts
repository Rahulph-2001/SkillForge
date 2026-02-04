import { Request, Response, NextFunction } from "express";
import { IAdminListReportsUseCase } from "../../../application/useCases/admin/interfaces/IAdminListReportsUseCase";
import { IAdminManageReportUseCase } from "../../../application/useCases/admin/interfaces/IAdminManageReportUseCase";
export declare class AdminReportController {
    private listReportsUseCase;
    private manageReportUseCase;
    constructor(listReportsUseCase: IAdminListReportsUseCase, manageReportUseCase: IAdminManageReportUseCase);
    listReports(req: Request, res: Response, next: NextFunction): Promise<void>;
    manageReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdminReportController.d.ts.map