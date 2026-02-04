import { Request, Response, NextFunction } from 'express';
import { Profile } from 'passport-google-oauth20';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IRegisterUseCase } from '../../../application/useCases/auth/interfaces/IRegisterUseCase';
import { ILoginUseCase } from '../../../application/useCases/auth/interfaces/ILoginUseCase';
import { IVerifyOtpUseCase } from '../../../application/useCases/auth/interfaces/IVerifyOtpUseCase';
import { IGoogleAuthUseCase } from '../../../application/useCases/auth/interfaces/IGoogleAuthUseCase';
import { IPassportService } from '../../../domain/services/IPassportService';
import { IResendOtpUseCase } from '../../../application/useCases/auth/interfaces/IResendOtpUseCase';
import { IAdminLoginUseCase } from '../../../application/useCases/auth/interfaces/IAdminLoginUseCase';
import { IForgotPasswordUseCase } from '../../../application/useCases/auth/interfaces/IForgotPasswordUseCase';
import { IVerifyForgotPasswordOtpUseCase } from '../../../application/useCases/auth/interfaces/IVerifyForgotPasswordOtpUseCase';
import { IResetPasswordUseCase } from '../../../application/useCases/auth/interfaces/IResetPasswordUseCase';
import { IGetUserByIdUseCase } from '../../../application/useCases/user/interfaces/IGetUserByIdUseCase';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { env } from '../../../config/env';
import { IAuthResponseMapper } from './interfaces/IAuthResponseMapper';
import { ERROR_MESSAGES } from '../../../config/messages';

const getClientIp = (req: Request): string | undefined => {
  return (
    req.ip ||
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress
  );
};

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.IPassportService) public readonly passportService: IPassportService,
    @inject(TYPES.IRegisterUseCase) private readonly registerUseCase: IRegisterUseCase,
    @inject(TYPES.ILoginUseCase) private readonly loginUseCase: ILoginUseCase,
    @inject(TYPES.IVerifyOtpUseCase) private readonly verifyOtpUseCase: IVerifyOtpUseCase,
    @inject(TYPES.IResendOtpUseCase) private readonly resendOtpUseCase: IResendOtpUseCase,
    @inject(TYPES.IAdminLoginUseCase) private readonly adminLoginUseCase: IAdminLoginUseCase,
    @inject(TYPES.IGoogleAuthUseCase) private readonly googleAuthUseCase: IGoogleAuthUseCase,
    @inject(TYPES.IForgotPasswordUseCase) private readonly forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject(TYPES.IVerifyForgotPasswordOtpUseCase) private readonly verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordOtpUseCase,
    @inject(TYPES.IResetPasswordUseCase) private readonly resetPasswordUseCase: IResetPasswordUseCase,
    @inject(TYPES.IGetUserByIdUseCase) private readonly getUserByIdUseCase: IGetUserByIdUseCase,
    @inject(TYPES.IAuthResponseMapper) private readonly authResponseMapper: IAuthResponseMapper
  ) {
    this.googleLogin = this.passportService.authenticateGoogle();
  }

  public readonly googleLogin: ReturnType<IPassportService['authenticateGoogle']>;

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const registrationIp = getClientIp(req);
      const { email, expiresAt, message } = await this.registerUseCase.execute(req.body, registrationIp);
      res
        .status(HttpStatusCode.CREATED)
        .json(this.authResponseMapper.mapRegisterResponse(email, expiresAt, message));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = getClientIp(req);
      const { user, token, refreshToken } = await this.loginUseCase.execute(req.body, ipAddress);

      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      });

      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res
        .status(HttpStatusCode.OK)
        .json(this.authResponseMapper.mapLoginResponse(user, token, refreshToken));
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, message, token, refreshToken } = await this.verifyOtpUseCase.execute(req.body);

      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      });

      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          this.authResponseMapper.mapVerifyOtpResponse(user, message, token, refreshToken)
        );
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = getClientIp(req);
      const result = await this.resendOtpUseCase.execute(req.body, ipAddress);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User token payload is attached to req by auth middleware
      const tokenPayload = req.user;
      if (!tokenPayload || !tokenPayload.userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      // Fetch full user data from database to get name, credits, etc.
      const user = await this.getUserByIdUseCase.execute(tokenPayload.userId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email.value,
            role: user.role,
            credits: user.credits,
            avatar: user.avatarUrl, // Include avatar URL
            subscriptionPlan: user.subscriptionPlan,
            verification: {
              email_verified: user.verification.email_verified,
            },
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear both accessToken and refreshToken cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      });

      res.status(HttpStatusCode.OK).json(this.authResponseMapper.mapLogoutResponse());
    } catch (error) {
      next(error);
    }
  }

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = getClientIp(req);
      const { user, token, refreshToken } =
        await this.adminLoginUseCase.execute(req.body, ipAddress);

      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      });

      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      res
        .status(HttpStatusCode.OK)
        .json(this.authResponseMapper.mapLoginResponse(user, token, refreshToken));
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const googleProfile = req.user as unknown as Profile;
      if (!googleProfile) {
        res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
        return;
      }
      const result = await this.googleAuthUseCase.execute(googleProfile);

      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', result.token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE,
      });

      // Set refreshToken cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: env.GOOGLE_REFRESH_TOKEN_COOKIE_MAX_AGE,
      });

      // Redirect to frontend callback page with isNewUser flag
      const redirectUrl = result.isNewUser
        ? `${env.FRONTEND_URL}/auth/google/callback?isNewUser=true`
        : `${env.FRONTEND_URL}/auth/google/callback`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      // Handle suspended user error - redirect to login with message
      if (error.name === 'ForbiddenError' || error.statusCode === 403) {
        const errorMessage = encodeURIComponent(error.message || 'Account suspended');
        res.redirect(`${env.FRONTEND_URL}/login?error=account_suspended&message=${errorMessage}`);
        return;
      }
      // For other errors, redirect to login with generic error
      res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = getClientIp(req);
      const result = await this.forgotPasswordUseCase.execute(req.body, ipAddress);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyForgotPasswordOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.verifyForgotPasswordOtpUseCase.execute(req.body);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          verified: result.verified,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.resetPasswordUseCase.execute(req.body);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async validateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      // Check if user is suspended or deleted
      if (!user.isActive || user.isDeleted) {
        res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          error: ERROR_MESSAGES.AUTH.ACCOUNT_SUSPENDED,
          data: {
            isActive: false,
          },
        });
        return;
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: {
          isActive: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
