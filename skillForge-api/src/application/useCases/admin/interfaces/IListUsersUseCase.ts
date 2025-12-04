import { ListUsersRequestDTO } from '../../../dto/admin/ListUsersRequestDTO';
import { ListUsersResponseDTO } from '../../../dto/admin/ListUsersResponseDTO';

export interface IListUsersUseCase {
  execute(request: ListUsersRequestDTO): Promise<ListUsersResponseDTO>;
}
