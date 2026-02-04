import { IReportRepository, CreateReportDTO } from "../../../domain/repositories/IReportRepository";
import { ICreateReportUseCase } from "./interfaces/ICreateReportUseCase";
export declare class CreateReportUseCase implements ICreateReportUseCase {
    private reportRepository;
    constructor(reportRepository: IReportRepository);
    execute(data: CreateReportDTO): Promise<void>;
}
//# sourceMappingURL=CreateReportUseCase.d.ts.map