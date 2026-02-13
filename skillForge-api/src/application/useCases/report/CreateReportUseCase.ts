import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { IReportRepository, CreateReportDTO } from "../../../domain/repositories/IReportRepository";
import { ICreateReportUseCase } from "./interfaces/ICreateReportUseCase";
import { IAdminNotificationService } from "../../../domain/services/IAdminNotificationService";
import { NotificationType } from "../../../domain/entities/Notification";

@injectable()
export class CreateReportUseCase implements ICreateReportUseCase {
    constructor(
        @inject(TYPES.IReportRepository) private reportRepository: IReportRepository,
        @inject(TYPES.IAdminNotificationService) private adminNotificationService: IAdminNotificationService
    ) { }

    async execute(data: CreateReportDTO): Promise<void> {
        if (!data.reporterId) throw new Error("Reporter ID is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.type) throw new Error("Report type is required");

        const report = await this.reportRepository.create({
            reporterId: data.reporterId,
            type: data.type,
            category: data.category,
            description: data.description,
            targetUserId: data.targetUserId,
            projectId: data.projectId
        });

        // Notify admins about new report
        await this.adminNotificationService.notifyAllAdmins({
            type: NotificationType.NEW_REPORT_SUBMITTED,
            title: 'New Content Report',
            message: `A new report has been submitted for ${data.type}.`,
            data: { reportId: report.id, reporterId: report.reporterId }
        });
    }
}
