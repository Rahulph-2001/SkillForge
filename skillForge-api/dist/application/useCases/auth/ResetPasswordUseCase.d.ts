import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { ResetPasswordDTO } from '../../dto/auth/ResetPasswordDTO';
import { IResetPasswordUseCase, ResetPasswordResponseDTO } from './interfaces/IResetPasswordUseCase';
export declare class ResetPasswordUseCase implements IResetPasswordUseCase {
    private userRepository;
    private otpRepository;
    private passwordService;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, passwordService: IPasswordService);
    execute(request: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
//# sourceMappingURL=ResetPasswordUseCase.d.ts.map