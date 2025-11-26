import { ListUsersResponse } from '../admin/ListUsersUseCase';
import { SuspendUserDTO } from '../../dto/user/SuspendUserDTO'
import { SuspendUserResponse } from '../admin/SuspendUserUseCase';

export interface IAdminUseCase {
  listUsers(adminUserId: string): Promise<ListUsersResponse>;
  suspendUser(adminUserId: string, request: SuspendUserDTO): Promise<SuspendUserResponse>;
}