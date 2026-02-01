import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';
export declare class GetContributingProjectsUseCase {
    private projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(userId: string): Promise<Project[]>;
}
//# sourceMappingURL=GetContributingProjectsUseCase.d.ts.map