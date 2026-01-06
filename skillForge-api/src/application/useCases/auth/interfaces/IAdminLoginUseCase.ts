import { AdminLoginDTO } from '../../../dto/auth/AdminLoginDTO';
import { UserResponseDTO } from '../../../dto/auth/UserResponseDTO';

export interface AdminLoginResponseDTO {
  user: UserResponseDTO;
  token: string;
  refreshToken: string;
}

export interface IAdminLoginUseCase {
  execute(request: AdminLoginDTO, ipAddress?: string): Promise<AdminLoginResponseDTO>;
}

