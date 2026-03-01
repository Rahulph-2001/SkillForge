import { type VerifyOtpDTO } from '../../../dto/auth/VerifyOtpDTO';
import { type VerifyOtpResponseDTO } from '../../../dto/auth/VerifyOtpResponseDTO';

export interface IVerifyOtpUseCase {
  execute(request: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}
