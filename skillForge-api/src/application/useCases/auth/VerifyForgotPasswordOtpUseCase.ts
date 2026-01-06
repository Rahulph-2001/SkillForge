import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { NotFoundError, UnauthorizedError } from '../../../domain/errors/AppError';
import { VerifyForgotPasswordOtpDTO } from '../../dto/auth/VerifyForgotPasswordOtpDTO';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IVerifyForgotPasswordOtpUseCase, VerifyForgotPasswordOtpResponseDTO } from './interfaces/IVerifyForgotPasswordOtpUseCase';

@injectable()
export class VerifyForgotPasswordOtpUseCase implements IVerifyForgotPasswordOtpUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository
  ) {}

  async execute(request: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO> {
    const { email: rawEmail, otpCode } = request;
    const email = rawEmail.toLowerCase().trim();

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    // Find OTP by code and contact info
    const otp = await this.otpRepository.findByCode(otpCode, email);
    if (!otp) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    // Verify OTP belongs to this user and is for password reset
    if (otp.userId !== user.id || otp.otpType !== 'password_reset') {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    // Check if OTP is expired
    if (otp.isExpired()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    // If OTP is already verified, return success (allow re-verification for better UX)
    // This allows users to navigate back and forth without issues
    if (otp.isVerified) {
      return {
        success: true,
        message: 'OTP already verified. You can proceed to reset your password.',
        verified: true,
      };
    }

    // Check if max attempts exceeded
    if (!otp.isValid()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_MAX_ATTEMPTS);
    }

    // Verify the OTP
    try {
      if (otp.otpCode !== otpCode) {
        otp.incrementAttempts();
        await this.otpRepository.update(otp);
        throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
      }

      // Mark OTP as verified
      otp.verify();
      await this.otpRepository.update(otp);

      return {
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        verified: true,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }
  }
}

