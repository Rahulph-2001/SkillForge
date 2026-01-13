import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { VerifyForgotPasswordOtpDTO } from '../../dto/auth/VerifyForgotPasswordOtpDTO';
import { IVerifyForgotPasswordOtpUseCase, VerifyForgotPasswordOtpResponseDTO } from './interfaces/IVerifyForgotPasswordOtpUseCase';
export declare class VerifyForgotPasswordOtpUseCase implements IVerifyForgotPasswordOtpUseCase {
    private userRepository;
    private otpRepository;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository);
    execute(request: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO>;
}
//# sourceMappingURL=VerifyForgotPasswordOtpUseCase.d.ts.map