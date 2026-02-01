import { IWithdrawApplicationUseCase } from './interfaces/IWithdrawApplicationUseCase';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectApplicationMapper } from '../../mappers/interfaces/IProjectApplicationMapper';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
export declare class WithdrawApplicationUseCase implements IWithdrawApplicationUseCase {
    private readonly applicationRepository;
    private readonly mapper;
    constructor(applicationRepository: IProjectApplicationRepository, mapper: IProjectApplicationMapper);
    execute(applicationId: string, applicantId: string): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=WithdrawApplicationUseCase.d.ts.map