import { ProjectResponseDTO } from '../../../dto/project/ProjectResponseDTO';
export interface IGetProjectUseCase {
    execute(projectId: string): Promise<ProjectResponseDTO>;
}
//# sourceMappingURL=IGetProjectUseCase.d.ts.map