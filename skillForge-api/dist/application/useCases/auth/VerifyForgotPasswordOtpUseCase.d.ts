import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { VerifyForgotPasswordOtpDTO } from '../../dto/auth/VerifyForgotPasswordOtpDTO';
export interface VerifyForgotPasswordOtpResponse {
    success: boolean;
    message: string;
    verified: boolean;
}
export declare class VerifyForgotPasswordOtpUseCase {
    private userRepository;
    private otpRepository;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository);
    execute(request: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponse>;
}
//# sourceMappingURL=VerifyForgotPasswordOtpUseCase.d.ts.map