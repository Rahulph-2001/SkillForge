import { type User } from '../../../domain/entities/User';
import { type UserAdminDTO } from '../../dto/admin/UserAdminDTO';

export interface IAdminUserDTOMapper {
  toDTO(user: User): UserAdminDTO;
}
