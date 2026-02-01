import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetProjectUseCase } from './interfaces/IGetProjectUseCase';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
export declare class GetProjectUseCase implements IGetProjectUseCase {
    private readonly projectRepository;
    private readonly userRepository;
    constructor(projectRepository: IProjectRepository, userRepository: IUserRepository);
    execute(projectId: string): Promise<ProjectResponseDTO>;
}
//# sourceMappingURL=GetProjectUseCase.d.ts.map