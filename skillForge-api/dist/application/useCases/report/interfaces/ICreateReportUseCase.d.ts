import { CreateReportDTO } from "../../../../domain/repositories/IReportRepository";
export interface ICreateReportUseCase {
    execute(data: CreateReportDTO): Promise<void>;
}
//# sourceMappingURL=ICreateReportUseCase.d.ts.map