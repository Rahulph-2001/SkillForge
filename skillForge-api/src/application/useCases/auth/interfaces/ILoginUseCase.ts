import { LoginDTO } from '../../../dto/auth/LoginDTO';
import { LoginResponseDTO } from '../../../dto/auth/LoginResponseDTO';

export interface ILoginUseCase {
  execute(request: LoginDTO, ipAddress?: string): Promise<LoginResponseDTO>;
}
