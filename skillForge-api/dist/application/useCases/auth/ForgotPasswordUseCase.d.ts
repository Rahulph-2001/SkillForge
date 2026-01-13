import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { ForgotPasswordDTO } from '../../dto/auth/ForgotPasswordDTO';
import { IForgotPasswordUseCase, ForgotPasswordResponseDTO } from './interfaces/IForgotPasswordUseCase';
export declare class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    private userRepository;
    private otpRepository;
    private otpService;
    private emailService;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, otpService: IOTPService, emailService: IEmailService);
    execute(request: ForgotPasswordDTO, ipAddress?: string): Promise<ForgotPasswordResponseDTO>;
}
//# sourceMappingURL=ForgotPasswordUseCase.d.ts.map