import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { IReportRepository, CreateReportDTO } from "../../../domain/repositories/IReportRepository";
import { ICreateReportUseCase } from "./interfaces/ICreateReportUseCase";

@injectable()
export class CreateReportUseCase implements ICreateReportUseCase {
    constructor(
        @inject(TYPES.IReportRepository) private reportRepository: IReportRepository
    ) { }

    async execute(data: CreateReportDTO): Promise<void> {
        if (!data.reporterId) throw new Error("Reporter ID is required");
        if (!data.description) throw new Error("Description is required");
        if (!data.type) throw new Error("Report type is required");

        await this.reportRepository.create({
            reporterId: data.reporterId,
            type: data.type,
            category: data.category,
            description: data.description,
            targetUserId: data.targetUserId,
            projectId: data.projectId
        });
    }
}
