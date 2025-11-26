import { AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { LoginDTO } from '../../dto/auth/LoginDTO';
import { RegisterDTO } from '../../dto/auth/RegisterDTO';
import { ResendOtpDTO } from '../../dto/auth/ResendOtpDTO';
import { VerifyOtpDTO } from '../../dto/auth/VerifyOtpDTO';
import { Profile } from 'passport-google-oauth20'; // For Google

// Response types (simplified, import from use cases)
export interface LoginResponse {
  user: any; // Replace with UserResponseDTO
  token: string;
  refreshToken: string;
}

export interface IAuthUseCase {
  register(request: RegisterDTO, registrationIp?: string): Promise<any>; // RegisterResponse
  login(request: LoginDTO, ipAddress?: string): Promise<LoginResponse>;
  verifyOtp(request: VerifyOtpDTO): Promise<any>; // VerifyOtpResponse
  resendOtp(request: ResendOtpDTO, ipAddress?: string): Promise<any>; // ResendOtpResponse
  adminLogin(request: AdminLoginDTO, ipAddress?: string): Promise<LoginResponse>;
  googleAuth(googleProfile: Profile): Promise<LoginResponse>;
}