import { User } from '../../../domain/entities/User';
import { UserAdminDTO } from '../../dto/admin/UserAdminDTO';

export interface IAdminUserDTOMapper {
  toDTO(user: User): UserAdminDTO;
}
