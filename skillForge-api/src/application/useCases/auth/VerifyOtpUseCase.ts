import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../shared/value-objects/Email';
import { NotFoundError, UnauthorizedError, ConflictError, ForbiddenError, InternalServerError } from '../../../domain/errors/AppError';
import { VerifyOtpDTO } from '../../dto/auth/VerifyOtpDTO';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { VerifyOtpResponseDTO } from '../../dto/auth/VerifyOtpResponseDTO';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../config/messages';
import { IVerifyOtpUseCase } from './interfaces/IVerifyOtpUseCase';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IOTPRepository) private otpRepository: IOTPRepository,
    @inject(TYPES.IEmailService) private emailService: IEmailService,
    @inject(TYPES.IJWTService) private jwtService: IJWTService,
    @inject(TYPES.IPendingRegistrationService) private pendingRegistrationService: IPendingRegistrationService,
    @inject(TYPES.IUserDTOMapper) private userDTOMapper: IUserDTOMapper,
    @inject(TYPES.IAdminNotificationService) private adminNotificationService: IAdminNotificationService
  ) { }

  async execute(request: VerifyOtpDTO): Promise<VerifyOtpResponseDTO> {
    const { email: rawEmail, otpCode } = request;

    // Check if this is a new registration (pending) or existing unverified user
    let user = await this.userRepository.findByEmail(rawEmail);
    const pendingRegistration = await this.pendingRegistrationService.getPendingRegistration(rawEmail);

    if (!user && !pendingRegistration) {
      throw new NotFoundError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (user && user.verification.email_verified) {
      throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
    }
    const otpToken = await this.otpRepository.findByCode(otpCode, rawEmail);
    if (!otpToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }
    if (otpToken.otpCode !== otpCode) {
      try {
        otpToken.incrementAttempts();
        await this.otpRepository.update(otpToken);
      } catch (e) {
        throw new ForbiddenError(ERROR_MESSAGES.AUTH.OTP_MAX_ATTEMPTS);
      }
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }
    if (!otpToken.isValid()) {
      await this.otpRepository.deleteExpiredTokens();
      throw new ForbiddenError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }
    // Mark OTP as verified
    otpToken.verify();
    await this.otpRepository.update(otpToken);

    // CRITICAL: Create user from pending registration if this is first-time verification
    if (pendingRegistration) {
      const newUser = new User({
        name: pendingRegistration.fullName,
        email: new Email(pendingRegistration.email),
        password: pendingRegistration.passwordHash,
        role: 'user',
        bonusCredits: pendingRegistration.bonusCredits,
        registrationIp: pendingRegistration.registrationIp,
        avatarUrl: pendingRegistration.avatarUrl,
      });

      // Mark email as verified immediately
      newUser.verifyEmail();

      // Save user to database ONLY after OTP verification
      user = await this.userRepository.save(newUser);

      // Clean up pending registration
      await this.pendingRegistrationService.deletePendingRegistration(rawEmail);

      // Notify admins about new user registration
      await this.adminNotificationService.notifyAllAdmins({
        type: NotificationType.NEW_USER_REGISTERED,
        title: 'New User Registration',
        message: `${newUser.name} has registered on the platform.`,
        data: { userId: newUser.id, email: newUser.email.value }
      });
    } else if (user) {
      // Existing user verification
      user.verifyEmail();
      await this.userRepository.update(user);
    }

    // Safety check - should never happen due to earlier validation
    if (!user) {
      throw new InternalServerError('User creation or retrieval failed during OTP verification');
    }

    try {
      await this.emailService.sendWelcomeEmail(user.email.value, user.name);
    } catch (error) {
      console.warn('Welcome email failed to send:', error);
    }
    const tokenPayload = {
      userId: user.id,
      email: user.email.value,
      role: user.role,
    };
    const refreshTokenPayload = {
      userId: user.id,
      email: user.email.value,
    };
    const token = this.jwtService.generateToken(tokenPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);
    return {
      user: await this.userDTOMapper.toUserResponseDTO(user),
      token,
      refreshToken,
      message: SUCCESS_MESSAGES.AUTH.VERIFY_OTP_SUCCESS
    };
  }
}