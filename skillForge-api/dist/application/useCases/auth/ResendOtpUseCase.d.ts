import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { ResendOtpDTO } from '../../dto/auth/ResendOtpDTO';
export interface ResendOtpResponse {
    success: boolean;
    message: string;
    expiresAt?: Date | null;
}
export declare class ResendOtpUseCase {
    private userRepository;
    private otpRepository;
    private otpService;
    private emailService;
    private pendingRegistrationService;
    constructor(userRepository: IUserRepository, otpRepository: IOTPRepository, otpService: IOTPService, emailService: IEmailService, pendingRegistrationService: IPendingRegistrationService);
    execute(request: ResendOtpDTO, ipAddress?: string): Promise<ResendOtpResponse>;
}
//# sourceMappingURL=ResendOtpUseCase.d.ts.map