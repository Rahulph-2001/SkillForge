import { AdminLoginDTO } from '../../dto/auth/AdminLoginDTO';
import { LoginDTO } from '../../dto/auth/LoginDTO';
import { RegisterDTO } from '../../dto/auth/RegisterDTO';
import { ResendOtpDTO } from '../../dto/auth/ResendOtpDTO';
import { VerifyOtpDTO } from '../../dto/auth/VerifyOtpDTO';
import { Profile } from 'passport-google-oauth20';
export interface LoginResponse {
    user: any;
    token: string;
    refreshToken: string;
}
export interface IAuthUseCase {
    register(request: RegisterDTO, registrationIp?: string): Promise<any>;
    login(request: LoginDTO, ipAddress?: string): Promise<LoginResponse>;
    verifyOtp(request: VerifyOtpDTO): Promise<any>;
    resendOtp(request: ResendOtpDTO, ipAddress?: string): Promise<any>;
    adminLogin(request: AdminLoginDTO, ipAddress?: string): Promise<LoginResponse>;
    googleAuth(googleProfile: Profile): Promise<LoginResponse>;
}
//# sourceMappingURL=IAuthUseCase.d.ts.map