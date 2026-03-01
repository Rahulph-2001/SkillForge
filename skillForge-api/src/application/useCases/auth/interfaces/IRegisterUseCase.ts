import { type RegisterDTO } from '../../../dto/auth/RegisterDTO';
import { type RegisterResponseDTO } from '../../../dto/auth/RegisterResponseDTO';

export interface IRegisterUseCase {
  execute(request: RegisterDTO, registrationIp?: string): Promise<RegisterResponseDTO>;
}
