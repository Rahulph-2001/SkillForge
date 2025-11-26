export interface IEmailService {
  sendOTPEmail(email: string, otpCode: string, userName: string): Promise<void>;
  sendWelcomeEmail(email: string, userName: string): Promise<void>;
  sendPasswordResetOTPEmail(email: string, otpCode: string, userName: string): Promise<void>;
}