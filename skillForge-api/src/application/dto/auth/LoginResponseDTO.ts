import { UserResponseDTO } from './UserResponseDTO';

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
  refreshToken: string;
}
