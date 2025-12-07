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
export declare class OTPToken {
    private _id;
    private _userId;
    private _otpType;
    private _contactInfo;
    private _otpCode;
    private _isVerified;
    private _attempts;
    private _maxAttempts;
    private _ipAddress;
    private _userAgent;
    private _createdAt;
    private _expiresAt;
    private _verifiedAt;
    constructor(data: CreateOTPData);
    private generateId;
    verify(): void;
    incrementAttempts(): void;
    isExpired(): boolean;
    isValid(): boolean;
    get id(): string;
    get userId(): string;
    get otpType(): OTPType;
    get contactInfo(): string;
    get otpCode(): string;
    get isVerified(): boolean;
    get attempts(): number;
    get maxAttempts(): number;
    get expiresAt(): Date;
    get createdAt(): Date;
    get verifiedAt(): Date | null;
    toJSON(): Record<string, unknown>;
}
//# sourceMappingURL=OTPToken.d.ts.map