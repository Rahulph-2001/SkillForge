import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { IReportRepository } from "../../../domain/repositories/IReportRepository";
import { ReportStatus } from "../../../domain/entities/Report";
import { NotFoundError, ValidationError } from "../../../domain/errors/AppError";
import { IAdminManageReportUseCase } from "./interfaces/IAdminManageReportUseCase";

@injectable()
export class AdminManageReportUseCase implements IAdminManageReportUseCase {
    constructor(
        @inject(TYPES.IReportRepository) private reportRepository: IReportRepository
    ) { }

    async execute(reportId: string, adminId: string, action: 'RESOLVE' | 'DISMISS' | 'REVIEW', resolution?: string): Promise<void> {
        const report = await this.reportRepository.findById(reportId);
        if (!report) {
            throw new NotFoundError("Report not found");
        }

        let newStatus: ReportStatus;
        switch (action) {
            case 'RESOLVE':
                newStatus = ReportStatus.RESOLVED;
                if (!resolution) throw new ValidationError("Resolution notes required to resolve a report");
                break;
            case 'DISMISS':
                newStatus = ReportStatus.DISMISSED;
                break;
            case 'REVIEW':
                newStatus = ReportStatus.REVIEWING;
                break;
            default:
                throw new ValidationError("Invalid action");
        }

        // Update domain entity properties for immutable/private props requires a method or we force it here since JS/TS allows if accessible (?) 
        // Our domain entity uses readonly props public but constructor private.
        // We usually should have methods on entity like `resolve(adminId, notes)`.
        // For expediency, we will bypass strict DDD method encapsulation if not present, but better to add it.
        // Let's assume we construct a new object or use a method.
        // Actually, the repository `update` takes a Report object. I should update the entity.

        // Let's add methods to Report entity implicitly by modifying the instance via update props logic or just create a new instance with updated props?
        // Simulating Entity Update:
        (report.props as any).status = newStatus;
        if (action === 'RESOLVE' || action === 'DISMISS') {
            (report.props as any).resolvedBy = adminId;
            (report.props as any).resolvedAt = new Date();
            if (resolution) (report.props as any).resolution = resolution;
        }

        await this.reportRepository.update(report);
    }
}
