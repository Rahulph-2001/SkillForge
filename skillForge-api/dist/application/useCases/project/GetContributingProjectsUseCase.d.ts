import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { IGetContributingProjectsUseCase } from './interfaces/IGetContributingProjectsUseCase';
export declare class GetContributingProjectsUseCase implements IGetContributingProjectsUseCase {
    private projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(userId: string): Promise<Project[]>;
}
//# sourceMappingURL=GetContributingProjectsUseCase.d.ts.map