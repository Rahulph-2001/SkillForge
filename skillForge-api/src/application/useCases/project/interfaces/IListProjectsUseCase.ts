import { type ListProjectsRequestDTO, type ListProjectsResponseDTO } from '../../../dto/project/ListProjectsDTO';

export interface IListProjectsUseCase {
  execute(filters: ListProjectsRequestDTO): Promise<ListProjectsResponseDTO>;
}

