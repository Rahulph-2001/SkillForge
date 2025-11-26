import { Request, Response, NextFunction } from 'express';
import { Profile } from 'passport-google-oauth20';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { RegisterUseCase } from '../../../application/useCases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../application/useCases/auth/LoginUseCase';
import { VerifyOtpUseCase } from '../../../application/useCases/auth/VerifyOtpUseCase';
import { GoogleAuthUseCase } from '../../../application/useCases/auth/GoogleAuthUseCase';
import { PassportService } from '../../../infrastructure/services/PassportService';
import { ResendOtpUseCase } from '../../../application/useCases/auth/ResendOtpUseCase';
import { AdminLoginUseCase } from '../../../application/useCases/auth/AdminLoginUseCase';
import { ForgotPasswordUseCase } from '../../../application/useCases/auth/ForgotPasswordUseCase';
import { VerifyForgotPasswordOtpUseCase } from '../../../application/useCases/auth/VerifyForgotPasswordOtpUseCase';
import { ResetPasswordUseCase } from '../../../application/useCases/auth/ResetPasswordUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { env } from '../../../config/env';
import { handleAsync } from '../../middlewares/responseHandler';
import { AuthResponseMapper } from './AuthResponseMapper';

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
    @inject(TYPES.PassportService) public readonly passportService: PassportService,
    @inject(TYPES.RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
    @inject(TYPES.LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @inject(TYPES.VerifyOtpUseCase) private readonly verifyOtpUseCase: VerifyOtpUseCase,
    @inject(TYPES.ResendOtpUseCase) private readonly resendOtpUseCase: ResendOtpUseCase,
    @inject(TYPES.AdminLoginUseCase) private readonly adminLoginUseCase: AdminLoginUseCase,
    @inject(TYPES.GoogleAuthUseCase) private readonly googleAuthUseCase: GoogleAuthUseCase,
    @inject(TYPES.ForgotPasswordUseCase) private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @inject(TYPES.VerifyForgotPasswordOtpUseCase) private readonly verifyForgotPasswordOtpUseCase: VerifyForgotPasswordOtpUseCase,
    @inject(TYPES.ResetPasswordUseCase) private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) {
    this.googleLogin = this.passportService.authenticateGoogle();
  }

  public readonly googleLogin: ReturnType<PassportService['authenticateGoogle']>;

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const registrationIp = getClientIp(req);
      const { email, expiresAt, message } = await this.registerUseCase.execute(req.body, registrationIp);
      res
        .status(HttpStatusCode.CREATED)
        .json(AuthResponseMapper.mapRegisterResponse(email, expiresAt, message));
    }, req, res, next);
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const ipAddress = getClientIp(req);
      const { user, token, refreshToken } = await this.loginUseCase.execute(req.body, ipAddress);
      
      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res
        .status(HttpStatusCode.OK)
        .json(AuthResponseMapper.mapLoginResponse(user, token, refreshToken));
    }, req, res, next);
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const { user, message, token, refreshToken } = await this.verifyOtpUseCase.execute(req.body);
      
      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res
        .status(HttpStatusCode.OK)
        .json(
          AuthResponseMapper.mapVerifyOtpResponse(user, message, token, refreshToken)
        );
    }, req, res, next);
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const ipAddress = getClientIp(req);
      const result = await this.resendOtpUseCase.execute(req.body, ipAddress);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
        },
      });
    }, req, res, next);
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      // User token payload is attached to req by auth middleware
      const tokenPayload = (req as any).user;
      if (!tokenPayload || !tokenPayload.userId) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      // Fetch full user data from database to get name, credits, etc.
      const user = await this.userRepository.findById(tokenPayload.userId);
      if (!user) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name, // Now from database
            email: user.email.value,
            role: user.role,
            credits: user.credits, // Now from database
            verification: {
              email_verified: user.verification.email_verified,
            },
          },
        },
      });
    }, req, res, next);
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
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
      
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    }, req, res, next);
  }

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const ipAddress = getClientIp(req);
      const { user, token, refreshToken } =
        await this.adminLoginUseCase.execute(req.body, ipAddress);
      
      // Set accessToken cookie (HTTP-only for security)
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res
        .status(HttpStatusCode.OK)
        .json(AuthResponseMapper.mapLoginResponse(user, token, refreshToken));
    }, req, res, next);
  }

  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const googleProfile = req.user as Profile;
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
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      // Set refreshToken cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect to frontend callback page with isNewUser flag
      const redirectUrl = result.isNewUser 
        ? `${env.FRONTEND_URL}/auth/google/callback?isNewUser=true`
        : `${env.FRONTEND_URL}/auth/google/callback`;
      res.redirect(redirectUrl);
    }, req, res, next);
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const ipAddress = getClientIp(req);
      const result = await this.forgotPasswordUseCase.execute(req.body, ipAddress);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          expiresAt: result.expiresAt,
        },
      });
    }, req, res, next);
  }

  async verifyForgotPasswordOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const result = await this.verifyForgotPasswordOtpUseCase.execute(req.body);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
        data: {
          verified: result.verified,
        },
      });
    }, req, res, next);
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const result = await this.resetPasswordUseCase.execute(req.body);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: result.message,
      });
    }, req, res, next);
  }
}
