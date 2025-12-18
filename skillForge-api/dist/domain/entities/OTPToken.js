"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPToken = void 0;
const uuid_1 = require("uuid");
const env_1 = require("../../config/env");
class OTPToken {
    constructor(data) {
        this._id = data.id || this.generateId();
        this._userId = data.userId;
        this._otpType = data.otpType;
        this._contactInfo = data.contactInfo;
        this._otpCode = data.otpCode;
        this._isVerified = false;
        this._attempts = 0;
        this._maxAttempts = env_1.env.OTP_MAX_ATTEMPTS;
        this._ipAddress = data.ipAddress || null;
        this._userAgent = data.userAgent || null;
        this._createdAt = new Date();
        const expiresInMinutes = data.expiresInMinutes || env_1.env.OTP_EXPIRY_MINUTES;
        this._expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        this._verifiedAt = null;
    }
    generateId() {
        return (0, uuid_1.v4)();
    }
    verify() {
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
    incrementAttempts() {
        this._attempts++;
        if (this._attempts >= this._maxAttempts) {
            throw new Error('Maximum verification attempts exceeded');
        }
    }
    isExpired() {
        return new Date() > this._expiresAt;
    }
    isValid() {
        return !this._isVerified && !this.isExpired() && this._attempts < this._maxAttempts;
    }
    // Getters
    get id() { return this._id; }
    get userId() { return this._userId; }
    get otpType() { return this._otpType; }
    get contactInfo() { return this._contactInfo; }
    get otpCode() { return this._otpCode; }
    get isVerified() { return this._isVerified; }
    get attempts() { return this._attempts; }
    get maxAttempts() { return this._maxAttempts; }
    get expiresAt() { return this._expiresAt; }
    get createdAt() { return this._createdAt; }
    get verifiedAt() { return this._verifiedAt; }
    toJSON() {
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
exports.OTPToken = OTPToken;
//# sourceMappingURL=OTPToken.js.map