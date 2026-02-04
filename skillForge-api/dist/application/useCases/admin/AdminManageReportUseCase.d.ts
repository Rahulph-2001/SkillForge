import { IReportRepository } from "../../../domain/repositories/IReportRepository";
import { IAdminManageReportUseCase } from "./interfaces/IAdminManageReportUseCase";
export declare class AdminManageReportUseCase implements IAdminManageReportUseCase {
    private reportRepository;
    constructor(reportRepository: IReportRepository);
    execute(reportId: string, adminId: string, action: 'RESOLVE' | 'DISMISS' | 'REVIEW', resolution?: string): Promise<void>;
}
//# sourceMappingURL=AdminManageReportUseCase.d.ts.map