import { VerifyForgotPasswordOtpDTO } from '../../../dto/auth/VerifyForgotPasswordOtpDTO';

export interface VerifyForgotPasswordOtpResponseDTO {
  success: boolean;
  message: string;
  verified: boolean;
}

export interface IVerifyForgotPasswordOtpUseCase {
  execute(request: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO>;
}

