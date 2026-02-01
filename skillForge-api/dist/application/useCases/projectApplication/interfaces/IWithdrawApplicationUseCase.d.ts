import { ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
export interface IWithdrawApplicationUseCase {
    execute(applicationId: string, applicantId: string): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=IWithdrawApplicationUseCase.d.ts.map