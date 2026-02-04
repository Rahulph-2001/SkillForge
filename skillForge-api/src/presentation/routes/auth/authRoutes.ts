import { Router, Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AuthController } from '../../controllers/auth/AuthController';
import { validate } from '../../validators/authValidator';
import { authLimiter, otpLimiter } from '../../middlewares/rateLimitMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { RegisterSchema } from '../../../application/dto/auth/RegisterDTO';
import { LoginSchema } from '../../../application/dto/auth/LoginDTO';
import { VerifyOtpSchema } from '../../../application/dto/auth/VerifyOtpDTO';
import { ResendOtpSchema } from '../../../application/dto/auth/ResendOtpDTO';
import { AdminLoginSchema } from '../../../application/dto/auth/AdminLoginDTO';
import { ForgotPasswordSchema } from '../../../application/dto/auth/ForgotPasswordDTO';
import { VerifyForgotPasswordOtpSchema } from '../../../application/dto/auth/VerifyForgotPasswordOtpDTO';
import { ResetPasswordSchema } from '../../../application/dto/auth/ResetPasswordDTO';
import { env } from '../../../config/env';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class AuthRoutes {
  public router = Router();

  constructor(@inject(TYPES.AuthController) private readonly authController: AuthController) {
    this.initializeRoutes();
  }


  private initializeRoutes(): void {
    // Passport is initialized at app level, no need to initialize here again

    // POST /api/v1/auth/register
    this.router.post(ENDPOINTS.AUTH.REGISTER,
      authLimiter,
      validate(RegisterSchema),
      this.authController.register.bind(this.authController)
    );

    // POST /api/v1/auth/login
    this.router.post(ENDPOINTS.AUTH.LOGIN,
      authLimiter,
      validate(LoginSchema),
      this.authController.login.bind(this.authController)
    );

    // POST /api/v1/auth/verify-otp
    this.router.post(ENDPOINTS.AUTH.VERIFY_OTP,
      authLimiter,
      validate(VerifyOtpSchema),
      this.authController.verifyOtp.bind(this.authController)
    );

    // POST /api/v1/auth/resend-otp
    this.router.post(ENDPOINTS.AUTH.RESEND_OTP,
      otpLimiter,
      validate(ResendOtpSchema),
      this.authController.resendOtp.bind(this.authController)
    );

    // GET /api/v1/auth/me (requires authentication)
    this.router.get(ENDPOINTS.AUTH.ME, authMiddleware, this.authController.getMe.bind(this.authController));

    // POST /api/v1/auth/logout
    this.router.post(ENDPOINTS.AUTH.LOGOUT, this.authController.logout.bind(this.authController));

    // POST /api/v1/auth/admin/login
    this.router.post(ENDPOINTS.AUTH.ADMIN_LOGIN,
      authLimiter,
      validate(AdminLoginSchema),
      this.authController.adminLogin.bind(this.authController)
    );

    // GET /api/v1/auth/google
    this.router.get(ENDPOINTS.AUTH.GOOGLE, this.authController.googleLogin);

    // GET /api/v1/auth/google/callback
    this.router.get(ENDPOINTS.AUTH.GOOGLE_CALLBACK,
      this.authController.passportService.authenticateGoogleCallback({
        failureRedirect: `${env.FRONTEND_URL}/login?error=google_auth_failed`
      }),
      (req: Request, res: Response, next: NextFunction) => this.authController.googleCallback(req, res, next)
    );

    // POST /api/v1/auth/forgot-password
    this.router.post(ENDPOINTS.AUTH.FORGOT_PASSWORD,
      authLimiter,
      validate(ForgotPasswordSchema),
      this.authController.forgotPassword.bind(this.authController)
    );

    // POST /api/v1/auth/verify-forgot-password-otp
    this.router.post(ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP,
      authLimiter,
      validate(VerifyForgotPasswordOtpSchema),
      this.authController.verifyForgotPasswordOtp.bind(this.authController)
    );

    // POST /api/v1/auth/reset-password
    this.router.post(ENDPOINTS.AUTH.RESET_PASSWORD,
      authLimiter,
      validate(ResetPasswordSchema),
      this.authController.resetPassword.bind(this.authController)
    );

    // GET /api/v1/auth/validate-status (requires authentication)
    this.router.get(ENDPOINTS.AUTH.VALIDATE_STATUS,
      authMiddleware,
      this.authController.validateUserStatus.bind(this.authController)
    );
  }
}
