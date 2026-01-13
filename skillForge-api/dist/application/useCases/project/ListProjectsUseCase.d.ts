import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListProjectsUseCase } from './interfaces/IListProjectsUseCase';
import { ListProjectsRequestDTO, ListProjectsResponseDTO } from '../../dto/project/ListProjectsDTO';
export declare class ListProjectsUseCase implements IListProjectsUseCase {
    private readonly projectRepository;
    private readonly userRepository;
    constructor(projectRepository: IProjectRepository, userRepository: IUserRepository);
    execute(filters: ListProjectsRequestDTO): Promise<ListProjectsResponseDTO>;
}
//# sourceMappingURL=ListProjectsUseCase.d.ts.map