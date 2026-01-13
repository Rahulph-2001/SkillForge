import { ListProjectsRequestDTO, ListProjectsResponseDTO } from '../../../dto/project/ListProjectsDTO';
export interface IListProjectsUseCase {
    execute(filters: ListProjectsRequestDTO): Promise<ListProjectsResponseDTO>;
}
//# sourceMappingURL=IListProjectsUseCase.d.ts.map