import { type User } from '../../../domain/entities/User';
import { type UserResponseDTO } from '../../dto/auth/UserResponseDTO';

export interface IUserDTOMapper {
  toUserResponseDTO(user: User): Promise<UserResponseDTO>;
}
