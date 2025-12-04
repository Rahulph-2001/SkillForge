import { UserAdminDTO } from './UserAdminDTO';

export interface ListUsersResponseDTO {
  users: UserAdminDTO[];
  total: number;
}
