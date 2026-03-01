import { type ListUsersRequestDTO } from '../../../dto/admin/ListUsersRequestDTO';
import { type ListUsersResponseDTO } from '../../../dto/admin/ListUsersResponseDTO';

export interface IListUsersUseCase {
  execute(request: ListUsersRequestDTO): Promise<ListUsersResponseDTO>;
}
