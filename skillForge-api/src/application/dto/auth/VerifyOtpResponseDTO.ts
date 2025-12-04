import { UserResponseDTO } from './UserResponseDTO';

export interface VerifyOtpResponseDTO {
  user: UserResponseDTO;
  token: string;
  refreshToken: string;
  message: string;
}
