import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { NotFoundError } from '../../../domain/errors/AppError';
import { ForgotPasswordDTO } from '../../dto/auth/ForgotPasswordDTO';
import { OTPToken } from '../../../domain/entities/OTPToken';
import { env } from '../../../config/env';
import { ERROR_MESSAGES } from '../../../config/messages';

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  expiresAt: Date;
}

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.IOTPService) private otpService: IOTPService,
    @inject(TYPES.IEmailService) private emailService: IEmailService
  ) {}

  async execute(request: ForgotPasswordDTO, ipAddress?: string): Promise<ForgotPasswordResponse> {
    const { email: rawEmail } = request;
    const email = rawEmail.toLowerCase().trim();
    
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    // Delete existing password reset OTP tokens for this user
    const existingOtp = await this.otpRepository.findByUserIdAndType(user.id, 'password_reset');
    if (existingOtp) {
      await this.otpRepository.deleteExpiredTokens();
    }

    // Generate new OTP code
    const otpCode = this.otpService.generateOTP();
    const otp = new OTPToken({
      userId: user.id,
      otpType: 'password_reset',
      contactInfo: user.email.value,
      otpCode: otpCode,
      ipAddress: ipAddress,
      expiresInMinutes: env.OTP_EXPIRY_MINUTES,
    });

    // Save OTP to repository
    await this.otpRepository.save(otp);

    // Send OTP email
    try {
      await this.emailService.sendPasswordResetOTPEmail(
        user.email.value,
        otpCode,
        user.name
      );
    } catch (error) {
      console.error('Failed to send password reset OTP email:', error);
      throw new Error(ERROR_MESSAGES.GENERAL.EMAIL_SEND_FAILED);
    }

    return {
      success: true,
      message: 'Password reset OTP sent to your email',
      expiresAt: otp.expiresAt,
    };
  }
}

