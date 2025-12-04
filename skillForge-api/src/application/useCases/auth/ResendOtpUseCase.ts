import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';
import { ResendOtpDTO } from '../../dto/auth/ResendOtpDTO';
import { OTPToken } from '../../../domain/entities/OTPToken';
import { env } from '../../../config/env';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  expiresAt?: Date | null;
}

@injectable()
export class ResendOtpUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.IOTPService) private otpService: IOTPService,
    @inject(TYPES.IEmailService) private emailService: IEmailService,
    @inject(TYPES.IPendingRegistrationService) private pendingRegistrationService: IPendingRegistrationService
  ) {}

  async execute(request: ResendOtpDTO, ipAddress?: string): Promise<ResendOtpResponse> {
    const { email: rawEmail } = request;
    
    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = rawEmail.toLowerCase().trim();
    
    // INDUSTRIAL LEVEL: Check BOTH pending registrations (Redis) AND database
    // 1. First check if this is a pending registration (user hasn't verified OTP yet)
    const pendingRegistration = await this.pendingRegistrationService.getPendingRegistration(normalizedEmail);
    
    if (pendingRegistration) {
      // Generate new OTP for pending registration
      const tempUserId = `temp_${Date.now()}_${normalizedEmail}`;
      const otpCode = this.otpService.generateOTP();
      
      const otp = new OTPToken({
        userId: tempUserId,
        otpType: 'email',
        contactInfo: normalizedEmail,
        otpCode: otpCode,
        ipAddress: ipAddress,
        expiresInMinutes: env.OTP_EXPIRY_MINUTES,
      });
      
      // Save OTP to repository
      await this.otpRepository.save(otp);
      
      // Send OTP email
      try {
        await this.emailService.sendOTPEmail(
          normalizedEmail,
          otpCode,
          pendingRegistration.fullName
        );
      } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw new Error(ERROR_MESSAGES.GENERAL.EMAIL_SEND_FAILED);
      }
      
      return {
        success: true,
        message: SUCCESS_MESSAGES.AUTH.RESEND_OTP_SUCCESS,
        expiresAt: otp.expiresAt,
      };
    }
    
    // 2. If not in pending registrations, check database for existing unverified user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }
    
    // Check if user is already verified
    if (user.verification.email_verified) {
      throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
    }
    
    // Delete existing OTP tokens for this user
    const existingOtp = await this.otpRepository.findByUserIdAndType(user.id, 'email');
    if (existingOtp) {
      await this.otpRepository.deleteExpiredTokens();
    }
    
    // Generate new OTP code
    const otpCode = this.otpService.generateOTP();
    
    const otp = new OTPToken({
      userId: user.id,
      otpType: 'email',
      contactInfo: user.email.value,
      otpCode: otpCode,
      ipAddress: ipAddress,
      expiresInMinutes: env.OTP_EXPIRY_MINUTES,
    });
    
    // Save OTP to repository
    await this.otpRepository.save(otp);
    
    // Send OTP email
    try {
      await this.emailService.sendOTPEmail(
        user.email.value,
        otpCode,
        user.name
      );
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error(ERROR_MESSAGES.GENERAL.EMAIL_SEND_FAILED);
    }
    
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.RESEND_OTP_SUCCESS,
      expiresAt: otp.expiresAt,
    };
  }
}