import { IReportRepository, CreateReportDTO } from "../../../domain/repositories/IReportRepository";
import { ICreateReportUseCase } from "./interfaces/ICreateReportUseCase";
import { IAdminNotificationService } from "../../../domain/services/IAdminNotificationService";
export declare class CreateReportUseCase implements ICreateReportUseCase {
    private reportRepository;
    private adminNotificationService;
    constructor(reportRepository: IReportRepository, adminNotificationService: IAdminNotificationService);
    execute(data: CreateReportDTO): Promise<void>;
}
//# sourceMappingURL=CreateReportUseCase.d.ts.map