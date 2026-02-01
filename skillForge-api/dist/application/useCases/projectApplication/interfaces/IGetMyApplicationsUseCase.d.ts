import { ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
export interface IGetMyApplicationsUseCase {
    execute(applicantId: string): Promise<ProjectApplicationResponseDTO[]>;
}
//# sourceMappingURL=IGetMyApplicationsUseCase.d.ts.map