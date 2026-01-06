import { ResetPasswordDTO } from '../../../dto/auth/ResetPasswordDTO';

export interface ResetPasswordResponseDTO {
  success: boolean;
  message: string;
}

export interface IResetPasswordUseCase {
  execute(request: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}

