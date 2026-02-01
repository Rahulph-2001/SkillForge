import { ProjectApplicationResponseDTO } from '../../../dto/projectApplication/ProjectApplicationResponseDTO';
import { ProjectApplicationStatus } from '../../../../domain/entities/ProjectApplication';
export interface IUpdateApplicationStatusUseCase {
    execute(applicationId: string, clientId: string, status: ProjectApplicationStatus): Promise<ProjectApplicationResponseDTO>;
}
//# sourceMappingURL=IUpdateApplicationStatusUseCase.d.ts.map