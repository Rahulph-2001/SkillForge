import { type AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { type LoginDTO } from '../../dto/auth/LoginDTO';
import { type RegisterDTO } from '../../dto/auth/RegisterDTO';
import { type ResendOtpDTO } from '../../dto/auth/ResendOtpDTO';
import { type VerifyOtpDTO } from '../../dto/auth/VerifyOtpDTO';
import { type Profile } from 'passport-google-oauth20'; // For Google

// Response types (simplified, import from use cases)
export interface LoginResponse {
  user: Record<string, unknown>;
  token: string;
  refreshToken: string;
}

export interface IAuthUseCase {
  register(request: RegisterDTO, registrationIp?: string): Promise<Record<string, unknown>>; // RegisterResponse
  login(request: LoginDTO, ipAddress?: string): Promise<LoginResponse>;
  verifyOtp(request: VerifyOtpDTO): Promise<Record<string, unknown>>; // VerifyOtpResponse
  resendOtp(request: ResendOtpDTO, ipAddress?: string): Promise<Record<string, unknown>>; // ResendOtpResponse
  adminLogin(request: AdminLoginDTO, ipAddress?: string): Promise<LoginResponse>;
  googleAuth(googleProfile: Profile): Promise<LoginResponse>;
}