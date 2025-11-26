import { OTPToken } from '../entities/OTPToken';

export interface IOTPRepository {
  save(otp: OTPToken): Promise<OTPToken>;
  findByUserIdAndType(userId: string, otpType: 'email' | 'password_reset'): Promise<OTPToken | null>;
  findByCode(code: string, contactInfo: string): Promise<OTPToken | null>;
  update(otp: OTPToken): Promise<OTPToken>;
  deleteExpiredTokens(): Promise<void>;
  deleteById(id: string): Promise<void>;
}