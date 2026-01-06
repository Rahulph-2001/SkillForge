import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { NotFoundError, UnauthorizedError } from '../../../domain/errors/AppError';
import { ResetPasswordDTO } from '../../dto/auth/ResetPasswordDTO';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../config/messages';
import { IResetPasswordUseCase, ResetPasswordResponseDTO } from './interfaces/IResetPasswordUseCase';

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.IPasswordService) private passwordService: IPasswordService
  ) {}

  async execute(request: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    const { email: rawEmail, otpCode, newPassword } = request;
    const email = rawEmail.toLowerCase().trim();

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    // Find and verify OTP
    const otp = await this.otpRepository.findByCode(otpCode, email);
    if (!otp) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    // Verify OTP belongs to this user and is for password reset
    if (otp.userId !== user.id || otp.otpType !== 'password_reset') {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    // Check if OTP is verified
    if (!otp.isVerified) {
      throw new UnauthorizedError('Please verify OTP first before resetting password');
    }

    // Check if OTP is expired
    if (otp.isExpired()) {
      throw new UnauthorizedError('OTP has expired. Please request a new password reset.');
    }

    // Hash new password
    const passwordHash = await this.passwordService.hash(newPassword);

    // Update user password using the proper method
    user.updatePassword(passwordHash);
    await this.userRepository.update(user);

    // Delete the used OTP immediately after password reset for security
    // This prevents the same OTP from being used again
    try {
      await this.otpRepository.deleteById(otp.id);
    } catch (error) {
      console.error('Error deleting OTP after password reset:', error);
      // Continue even if deletion fails - password has been reset successfully
    }

    // Also clean up any other expired tokens
    await this.otpRepository.deleteExpiredTokens();

    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS || 'Password reset successfully',
    };
  }
}

