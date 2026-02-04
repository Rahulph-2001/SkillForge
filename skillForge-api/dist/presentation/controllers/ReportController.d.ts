import { Request, Response, NextFunction } from "express";
import { ICreateReportUseCase } from "../../application/useCases/report/interfaces/ICreateReportUseCase";
export declare class ReportController {
    private createReportUseCase;
    constructor(createReportUseCase: ICreateReportUseCase);
    createReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ReportController.d.ts.map