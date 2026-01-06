import { ResendOtpDTO } from '../../../dto/auth/ResendOtpDTO';

export interface ResendOtpResponseDTO {
  success: boolean;
  message: string;
  expiresAt?: Date | null;
}

export interface IResendOtpUseCase {
  execute(request: ResendOtpDTO, ipAddress?: string): Promise<ResendOtpResponseDTO>;
}

