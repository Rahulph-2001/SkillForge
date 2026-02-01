import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';
export declare class GetMyProjectsUseCase {
    private projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(userId: string): Promise<Project[]>;
}
//# sourceMappingURL=GetMyProjectsUseCase.d.ts.map