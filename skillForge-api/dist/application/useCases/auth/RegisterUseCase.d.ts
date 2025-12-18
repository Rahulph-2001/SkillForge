import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { RegisterDTO } from '../../dto/auth/RegisterDTO';
import { IRegisterUseCase } from './interfaces/IRegisterUseCase';
import { RegisterResponseDTO } from '../../dto/auth/RegisterResponseDTO';
export declare class RegisterUseCase implements IRegisterUseCase {
    private userRepository;
    private otpRepository;
    private passwordService;
    private otpService;
    private emailService;
    private pendingRegistrationService;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, passwordService: IPasswordService, otpService: IOTPService, emailService: IEmailService, pendingRegistrationService: IPendingRegistrationService);
    execute(request: RegisterDTO, registrationIp?: string): Promise<RegisterResponseDTO>;
}
//# sourceMappingURL=RegisterUseCase.d.ts.map