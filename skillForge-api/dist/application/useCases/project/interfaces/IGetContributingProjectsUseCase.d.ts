import { Project } from '../../../../domain/entities/Project';
export interface IGetContributingProjectsUseCase {
    execute(userId: string): Promise<Project[]>;
}
//# sourceMappingURL=IGetContributingProjectsUseCase.d.ts.map