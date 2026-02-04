"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindAuthModule = void 0;
const types_1 = require("../types");
const RegisterUseCase_1 = require("../../../application/useCases/auth/RegisterUseCase");
const LoginUseCase_1 = require("../../../application/useCases/auth/LoginUseCase");
const VerifyOtpUseCase_1 = require("../../../application/useCases/auth/VerifyOtpUseCase");
const ResendOtpUseCase_1 = require("../../../application/useCases/auth/ResendOtpUseCase");
const AdminLoginUseCase_1 = require("../../../application/useCases/auth/AdminLoginUseCase");
const GoogleAuthUseCase_1 = require("../../../application/useCases/auth/GoogleAuthUseCase");
const ForgotPasswordUseCase_1 = require("../../../application/useCases/auth/ForgotPasswordUseCase");
const VerifyForgotPasswordOtpUseCase_1 = require("../../../application/useCases/auth/VerifyForgotPasswordOtpUseCase");
const ResetPasswordUseCase_1 = require("../../../application/useCases/auth/ResetPasswordUseCase");
const AuthController_1 = require("../../../presentation/controllers/auth/AuthController");
const authRoutes_1 = require("../../../presentation/routes/auth/authRoutes");
const PassportService_1 = require("../../services/PassportService");
/**
 * Binds all authentication-related use cases, controllers, and routes
 */
const bindAuthModule = (container) => {
    // Auth Use Cases
    container.bind(types_1.TYPES.RegisterUseCase).to(RegisterUseCase_1.RegisterUseCase);
    container.bind(types_1.TYPES.IRegisterUseCase).to(RegisterUseCase_1.RegisterUseCase);
    container.bind(types_1.TYPES.LoginUseCase).to(LoginUseCase_1.LoginUseCase);
    container.bind(types_1.TYPES.ILoginUseCase).to(LoginUseCase_1.LoginUseCase);
    container.bind(types_1.TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase_1.VerifyOtpUseCase);
    container.bind(types_1.TYPES.IVerifyOtpUseCase).to(VerifyOtpUseCase_1.VerifyOtpUseCase);
    container.bind(types_1.TYPES.ResendOtpUseCase).to(ResendOtpUseCase_1.ResendOtpUseCase);
    container.bind(types_1.TYPES.IResendOtpUseCase).to(ResendOtpUseCase_1.ResendOtpUseCase);
    container.bind(types_1.TYPES.AdminLoginUseCase).to(AdminLoginUseCase_1.AdminLoginUseCase);
    container.bind(types_1.TYPES.IAdminLoginUseCase).to(AdminLoginUseCase_1.AdminLoginUseCase);
    container.bind(types_1.TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase_1.GoogleAuthUseCase);
    container.bind(types_1.TYPES.IGoogleAuthUseCase).to(GoogleAuthUseCase_1.GoogleAuthUseCase);
    container.bind(types_1.TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase_1.ForgotPasswordUseCase);
    container.bind(types_1.TYPES.IForgotPasswordUseCase).to(ForgotPasswordUseCase_1.ForgotPasswordUseCase);
    container.bind(types_1.TYPES.VerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase_1.VerifyForgotPasswordOtpUseCase);
    container.bind(types_1.TYPES.IVerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase_1.VerifyForgotPasswordOtpUseCase);
    container.bind(types_1.TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase_1.ResetPasswordUseCase);
    container.bind(types_1.TYPES.IResetPasswordUseCase).to(ResetPasswordUseCase_1.ResetPasswordUseCase);
    container.bind(types_1.TYPES.IPassportService).to(PassportService_1.PassportService).inSingletonScope();
    // Auth Controllers & Routes
    container.bind(types_1.TYPES.AuthController).to(AuthController_1.AuthController);
    container.bind(types_1.TYPES.AuthRoutes).to(authRoutes_1.AuthRoutes);
};
exports.bindAuthModule = bindAuthModule;
//# sourceMappingURL=auth.bindings.js.map