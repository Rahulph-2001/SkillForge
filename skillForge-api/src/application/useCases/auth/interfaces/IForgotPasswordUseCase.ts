import { ForgotPasswordDTO } from '../../../dto/auth/ForgotPasswordDTO';

export interface ForgotPasswordResponseDTO {
  success: boolean;
  message: string;
  expiresAt: Date;
}

export interface IForgotPasswordUseCase {
  execute(request: ForgotPasswordDTO, ipAddress?: string): Promise<ForgotPasswordResponseDTO>;
}

