import { VerifyOtpDTO } from '../../../dto/auth/VerifyOtpDTO';
import { VerifyOtpResponseDTO } from '../../../dto/auth/VerifyOtpResponseDTO';

export interface IVerifyOtpUseCase {
  execute(request: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}
