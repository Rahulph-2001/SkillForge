import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { VerifyOtpDTO } from '../../dto/auth/VerifyOtpDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { VerifyOtpResponseDTO } from '../../dto/auth/VerifyOtpResponseDTO';
import { IVerifyOtpUseCase } from './interfaces/IVerifyOtpUseCase';
export declare class VerifyOtpUseCase implements IVerifyOtpUseCase {
    private userRepository;
    private otpRepository;
    private emailService;
    private jwtService;
    private pendingRegistrationService;
    private userDTOMapper;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, emailService: IEmailService, jwtService: IJWTService, pendingRegistrationService: IPendingRegistrationService, userDTOMapper: IUserDTOMapper);
    execute(request: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}
//# sourceMappingURL=VerifyOtpUseCase.d.ts.map