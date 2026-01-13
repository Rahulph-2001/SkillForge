import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICreateProjectUseCase } from './interfaces/ICreateProjectUseCase';
import { CreateProjectRequestDTO } from '../../dto/project/CreateProjectDTO';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
export declare class CreateProjectUseCase implements ICreateProjectUseCase {
    private readonly projectRepository;
    private readonly userRepository;
    constructor(projectRepository: IProjectRepository, userRepository: IUserRepository);
    execute(userId: string, request: CreateProjectRequestDTO, paymentId?: string): Promise<ProjectResponseDTO>;
}
//# sourceMappingURL=CreateProjectUseCase.d.ts.map