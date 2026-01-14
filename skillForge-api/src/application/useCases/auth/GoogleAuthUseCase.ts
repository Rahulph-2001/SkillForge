import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IJWTService } from '../../../domain/services/IJWTService';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../shared/value-objects/Email';
import { env } from '../../../config/env';
import { Profile } from 'passport-google-oauth20';
import crypto from 'crypto';
import { IUserDTOMapper } from '../../mappers/interfaces/IUserDTOMapper';
import { IGoogleAuthUseCase, GoogleAuthResponseDTO } from './interfaces/IGoogleAuthUseCase';
import { ValidationError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IJWTService) private jwtService: IJWTService,
    @inject(TYPES.IUserDTOMapper) private userDTOMapper: IUserDTOMapper
  ) { }

  async execute(googleProfile: Profile): Promise<GoogleAuthResponseDTO> {
    const googleEmail = googleProfile.emails?.[0]?.value;

    if (!googleEmail) {
      throw new ValidationError('Google profile is missing an email address.');
    }
    const fullName = this.extractFullName(googleProfile);
    const avatarUrl = googleProfile.photos?.[0]?.value;

    // Check for existing user
    let user = await this.userRepository.findByEmail(googleEmail);
    let isNewUser = false;

    if (!user) {
      // CRITICAL: New user from Google - create with verified email and free credits
      isNewUser = true;
      const newUser = new User({
        name: fullName,
        email: new Email(googleEmail),
        password: this.generateSecurePasswordHash(), // Secure random password for OAuth users
        role: 'user',
        bonusCredits: env.DEFAULT_BONUS_CREDITS, // Ensure free credits are given
        registrationIp: 'Google OAuth',
        avatarUrl: avatarUrl,
      });

      // Mark email as verified since Google verified it
      newUser.verifyEmail();

      // Save new user
      user = await this.userRepository.save(newUser);
    } else {
      // Check if existing user is suspended or deleted
      if (!user.isActive || user.isDeleted) {
        throw new ForbiddenError('Your account has been suspended. Please contact support.');
      }

      // Existing user - update avatar if changed and update login time
      if (avatarUrl && user.avatarUrl !== avatarUrl) {
        user.updateAvatar(avatarUrl);
      }

      // If user exists but email not verified (edge case), verify it
      if (!user.verification.email_verified) {
        user.verifyEmail();
      }
    }

    // Update last login for both new and existing users
    user.updateLastLogin('Google OAuth');
    await this.userRepository.update(user);

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
      isNewUser,
    };
  }

  private extractFullName(profile: Profile): string {
    if (profile.displayName) {
      return profile.displayName;
    }
    if (profile.name) {
      const parts: string[] = [];
      if (profile.name.givenName) parts.push(profile.name.givenName);
      if (profile.name.familyName) parts.push(profile.name.familyName);

      if (parts.length > 0) {
        return parts.join(' ');
      }
    }

    if (profile.emails?.[0]?.value) {
      return profile.emails[0].value.split('@')[0];
    }

    return 'Google User';
  }

  private generateSecurePasswordHash(): string {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `OAUTH_GOOGLE_${randomBytes}_${Date.now()}`;
  }
}