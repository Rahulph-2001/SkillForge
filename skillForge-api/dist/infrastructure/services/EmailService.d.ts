import { IEmailService } from '../../domain/services/IEmailService';
export declare class EmailService implements IEmailService {
    private transporter;
    constructor();
    sendOTPEmail(email: string, otpCode: string, userName: string): Promise<void>;
    sendWelcomeEmail(email: string, userName: string): Promise<void>;
    sendPasswordResetOTPEmail(email: string, otpCode: string, userName: string): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map