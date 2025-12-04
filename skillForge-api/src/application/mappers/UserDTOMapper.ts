import { injectable } from 'inversify';
import { User } from '../../domain/entities/User';
import { UserResponseDTO } from '../dto/auth/UserResponseDTO';
import { IUserDTOMapper } from './interfaces/IUserDTOMapper';

@injectable()
export class UserDTOMapper implements IUserDTOMapper {
  public toUserResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      avatarUrl: user.avatarUrl,
      verification: {
        email_verified: user.verification.email_verified
      }
    };
  }
}