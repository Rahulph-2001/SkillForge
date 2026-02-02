import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/di/types";
import { ICreateReportUseCase } from "../../application/useCases/report/interfaces/ICreateReportUseCase";
import { CreateReportDTO } from "../../domain/repositories/IReportRepository";
import { ReportType } from "../../domain/entities/Report";

@injectable()
export class ReportController {
    constructor(
        @inject(TYPES.ICreateReportUseCase) private createReportUseCase: ICreateReportUseCase
    ) { }

    async createReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, category, description, targetUserId, projectId } = req.body;
            // Assuming user ID comes from auth middleware in req.user.id
            const reporterId = (req as any).user?.id;

            const reportData: CreateReportDTO = {
                reporterId,
                type: type as ReportType,
                category,
                description,
                targetUserId,
                projectId
            };

            await this.createReportUseCase.execute(reportData);
            res.status(201).json({ message: "Report submitted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
