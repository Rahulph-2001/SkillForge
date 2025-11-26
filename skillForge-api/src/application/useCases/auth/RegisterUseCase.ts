import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { IOTPService } from '../../../domain/services/IOTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { Email } from '../../../shared/value-objects/Email';
import { Password } from '../../../shared/value-objects/Password';
import { OTPToken } from '../../../domain/entities/OTPToken';
import { ConflictError, ValidationError } from '../../../domain/errors/AppError';
import { RegisterDTO } from '../../dto/auth/RegisterDTO';
import { env } from '../../../config/env';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';

export interface RegisterResponse {
  email: string;
  expiresAt: string;
  message: string;
}

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.IPasswordService) private passwordService: IPasswordService,
    @inject(TYPES.IOTPService) private otpService: IOTPService,
    @inject(TYPES.IEmailService) private emailService: IEmailService,
    @inject(TYPES.IPendingRegistrationService) private pendingRegistrationService: IPendingRegistrationService
  ) {}

  async execute(request: RegisterDTO, registrationIp?: string): Promise<RegisterResponse> {
    const { fullName, email: rawEmail, password } = request;
    try {
      new Email(rawEmail);
      new Password(password);
    } catch (error) {
      throw new ValidationError((error as Error).message);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(rawEmail);
    if (existingUser && existingUser.verification.email_verified) {
      throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS || 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(password);

    // CRITICAL: Store pending registration in Redis (NOT in database)
    // User will only be created AFTER OTP verification
    await this.pendingRegistrationService.storePendingRegistration(rawEmail, {
      fullName,
      email: rawEmail,
      passwordHash,
      registrationIp,
      bonusCredits: env.DEFAULT_BONUS_CREDITS,
    });

    // Generate and save OTP with temporary userId
    const tempUserId = `temp_${Date.now()}_${rawEmail}`;
    const otpCode = this.otpService.generateOTP();
    console.log(`User's OTP is ${otpCode}`);
    
    const otp = new OTPToken({
      userId: tempUserId,
      otpType: 'email',
      contactInfo: rawEmail,
      otpCode: otpCode,
      ipAddress: registrationIp,
      expiresInMinutes: env.OTP_EXPIRY_MINUTES,
    });
    await this.otpRepository.save(otp);

    // Send OTP email
    try {
      await this.emailService.sendOTPEmail(
        rawEmail,
        otpCode,
        fullName
      );
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      // Clean up pending registration if email fails
      await this.pendingRegistrationService.deletePendingRegistration(rawEmail);
      throw error;
    }

    return {
      email: rawEmail,
      expiresAt: otp.expiresAt.toISOString(),
      message: SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
    };
  }
}