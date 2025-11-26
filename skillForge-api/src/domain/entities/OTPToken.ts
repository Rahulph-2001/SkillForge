import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { OTPType } from './type'; 

export interface CreateOTPData {
  id?: string;
  userId: string;
  otpType: OTPType;
  contactInfo: string;
  otpCode: string;
  ipAddress?: string;
  userAgent?: string;
  expiresInMinutes?: number;
}

export class OTPToken {
  private _id: string;
  private _userId: string;
  private _otpType: OTPType;
  private _contactInfo: string;
  private _otpCode: string;
  private _isVerified: boolean;
  private _attempts: number;
  private _maxAttempts: number;
  private _ipAddress: string | null;
  private _userAgent: string | null;
  private _createdAt: Date;
  private _expiresAt: Date;
  private _verifiedAt: Date | null;

  constructor(data: CreateOTPData) {
    this._id = data.id || this.generateId();
    this._userId = data.userId;
    this._otpType = data.otpType;
    this._contactInfo = data.contactInfo;
    this._otpCode = data.otpCode;
    this._isVerified = false;
    this._attempts = 0;
    this._maxAttempts = env.OTP_MAX_ATTEMPTS;
    this._ipAddress = data.ipAddress || null;
    this._userAgent = data.userAgent || null;
    this._createdAt = new Date();
    const expiresInMinutes = data.expiresInMinutes || env.OTP_EXPIRY_MINUTES;
    this._expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    this._verifiedAt = null;
  }

  private generateId(): string {
    return uuidv4();
  }

  public verify(): void {
    if (this._isVerified) {
      throw new Error('OTP is already verified');
    }
    if (this.isExpired()) {
      throw new Error('OTP has expired');
    }
    if (this._attempts >= this._maxAttempts) {
      throw new Error('Maximum verification attempts exceeded');
    }
    this._isVerified = true;
    this._verifiedAt = new Date();
  }

  public incrementAttempts(): void {
    this._attempts++;
    if (this._attempts >= this._maxAttempts) {
      throw new Error('Maximum verification attempts exceeded');
    }
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  public isValid(): boolean {
    return !this._isVerified && !this.isExpired() && this._attempts < this._maxAttempts;
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get otpType(): OTPType { return this._otpType; }
  get contactInfo(): string { return this._contactInfo; }
  get otpCode(): string { return this._otpCode; }
  get isVerified(): boolean { return this._isVerified; }
  get attempts(): number { return this._attempts; }
  get maxAttempts(): number { return this._maxAttempts; }
  get expiresAt(): Date { return this._expiresAt; }
  get createdAt(): Date { return this._createdAt; }
  get verifiedAt(): Date | null { return this._verifiedAt; }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      user_id: this._userId,
      otp_type: this._otpType,
      contact_info: this._contactInfo,
      otp_code: this._otpCode,
      is_verified: this._isVerified,
      attempts: this._attempts,
      max_attempts: this._maxAttempts,
      ip_address: this._ipAddress,
      user_agent: this._userAgent,
      created_at: this._createdAt,
      expires_at: this._expiresAt,
      verified_at: this._verifiedAt,
    };
  }
}