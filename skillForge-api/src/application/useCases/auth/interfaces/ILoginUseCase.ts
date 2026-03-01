import { type LoginDTO } from '../../../dto/auth/LoginDTO';
import { type LoginResponseDTO } from '../../../dto/auth/LoginResponseDTO';

export interface ILoginUseCase {
  execute(request: LoginDTO, ipAddress?: string): Promise<LoginResponseDTO>;
}
