import { Container } from 'inversify';
import { TYPES } from '../types';
import { RegisterUseCase } from '../../../application/useCases/auth/RegisterUseCase';
import { IRegisterUseCase } from '../../../application/useCases/auth/interfaces/IRegisterUseCase';
import { LoginUseCase } from '../../../application/useCases/auth/LoginUseCase';
import { ILoginUseCase } from '../../../application/useCases/auth/interfaces/ILoginUseCase';
import { VerifyOtpUseCase } from '../../../application/useCases/auth/VerifyOtpUseCase';
import { IVerifyOtpUseCase } from '../../../application/useCases/auth/interfaces/IVerifyOtpUseCase';
import { ResendOtpUseCase } from '../../../application/useCases/auth/ResendOtpUseCase';
import { IResendOtpUseCase } from '../../../application/useCases/auth/interfaces/IResendOtpUseCase';
import { AdminLoginUseCase } from '../../../application/useCases/auth/AdminLoginUseCase';
import { IAdminLoginUseCase } from '../../../application/useCases/auth/interfaces/IAdminLoginUseCase';
import { GoogleAuthUseCase } from '../../../application/useCases/auth/GoogleAuthUseCase';
import { IGoogleAuthUseCase } from '../../../application/useCases/auth/interfaces/IGoogleAuthUseCase';
import { ForgotPasswordUseCase } from '../../../application/useCases/auth/ForgotPasswordUseCase';
import { IForgotPasswordUseCase } from '../../../application/useCases/auth/interfaces/IForgotPasswordUseCase';
import { VerifyForgotPasswordOtpUseCase } from '../../../application/useCases/auth/VerifyForgotPasswordOtpUseCase';
import { IVerifyForgotPasswordOtpUseCase } from '../../../application/useCases/auth/interfaces/IVerifyForgotPasswordOtpUseCase';
import { ResetPasswordUseCase } from '../../../application/useCases/auth/ResetPasswordUseCase';
import { IResetPasswordUseCase } from '../../../application/useCases/auth/interfaces/IResetPasswordUseCase';
import { AuthController } from '../../../presentation/controllers/auth/AuthController';
import { AuthRoutes } from '../../../presentation/routes/auth/authRoutes';

/**
 * Binds all authentication-related use cases, controllers, and routes
 */
export const bindAuthModule = (container: Container): void => {
  // Auth Use Cases
  container.bind<RegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase);
  container.bind<IRegisterUseCase>(TYPES.IRegisterUseCase).to(RegisterUseCase);
  container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
  container.bind<ILoginUseCase>(TYPES.ILoginUseCase).to(LoginUseCase);
  container.bind<VerifyOtpUseCase>(TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase);
  container.bind<IVerifyOtpUseCase>(TYPES.IVerifyOtpUseCase).to(VerifyOtpUseCase);
  container.bind<ResendOtpUseCase>(TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
  container.bind<IResendOtpUseCase>(TYPES.IResendOtpUseCase).to(ResendOtpUseCase);
  container.bind<AdminLoginUseCase>(TYPES.AdminLoginUseCase).to(AdminLoginUseCase);
  container.bind<IAdminLoginUseCase>(TYPES.IAdminLoginUseCase).to(AdminLoginUseCase);
  container.bind<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase);
  container.bind<IGoogleAuthUseCase>(TYPES.IGoogleAuthUseCase).to(GoogleAuthUseCase);
  container.bind<ForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
  container.bind<IForgotPasswordUseCase>(TYPES.IForgotPasswordUseCase).to(ForgotPasswordUseCase);
  container.bind<VerifyForgotPasswordOtpUseCase>(TYPES.VerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase);
  container.bind<IVerifyForgotPasswordOtpUseCase>(TYPES.IVerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase);
  container.bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
  container.bind<IResetPasswordUseCase>(TYPES.IResetPasswordUseCase).to(ResetPasswordUseCase);
  
  // Auth Controllers & Routes
  container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
};

