import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { ResetPasswordDTO } from '../../dto/auth/ResetPasswordDTO';
export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}
export declare class ResetPasswordUseCase {
    private userRepository;
    private otpRepository;
    private passwordService;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, passwordService: IPasswordService);
    execute(request: ResetPasswordDTO): Promise<ResetPasswordResponse>;
}
//# sourceMappingURL=ResetPasswordUseCase.d.ts.map