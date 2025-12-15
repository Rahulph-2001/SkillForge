import { injectable } from 'inversify';
import { User } from '../../domain/entities/User';
import { UserAdminDTO } from '../dto/admin/UserAdminDTO';
import { IAdminUserDTOMapper } from './interfaces/IAdminUserDTOMapper';

@injectable()
export class AdminUserDTOMapper implements IAdminUserDTOMapper {
  public toDTO(user: User): UserAdminDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
      credits: user.credits,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      emailVerified: user.verification.email_verified,
      avatarUrl: user.avatarUrl
    };
  }
}
