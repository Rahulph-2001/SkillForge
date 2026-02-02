import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { IGetMyProjectsUseCase } from './interfaces/IGetMyProjectsUseCase';
export declare class GetMyProjectsUseCase implements IGetMyProjectsUseCase {
    private projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(userId: string): Promise<Project[]>;
}
//# sourceMappingURL=GetMyProjectsUseCase.d.ts.map