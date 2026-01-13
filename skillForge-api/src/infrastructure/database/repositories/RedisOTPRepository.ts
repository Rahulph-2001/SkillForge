import { injectable, inject } from 'inversify';
import { RedisService } from '../../services/RedisService';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { OTPToken } from '../../../domain/entities/OTPToken';
import { TYPES } from '../../di/types';
import { NotFoundError } from '../../../domain/errors/AppError';
import { BaseRedisRepository } from '../BaseRedisRepository';

@injectable()
export class RedisOTPRepository extends BaseRedisRepository implements IOTPRepository {
  private readonly OTP_PREFIX = 'otp:';
  private readonly OTP_USER_PREFIX = 'otp:user:';
  private readonly OTP_CODE_PREFIX = 'otp:code:';

  constructor(@inject(TYPES.RedisService) private redisService: RedisService) {
    super();
  }

  protected getKeyPrefix(): string {
    return this.OTP_PREFIX;
  }

  private getKey(userId: string, otpType: 'email' | 'password_reset'): string {
    return `${this.OTP_USER_PREFIX}${userId}:${otpType}`;
  }

  private getCodeKey(code: string, contactInfo: string): string {
    return `${this.OTP_CODE_PREFIX}${code}:${contactInfo}`;
  }

  private getOTPKey(otpId: string): string {
    return `${this.OTP_PREFIX}${otpId}`;
  }

  private mapToOTP(data: Record<string, unknown>): OTPToken {
    const otpData: {
      id: string;
      userId: string;
      otpType: 'email' | 'password_reset';
      contactInfo: string;
      otpCode: string;
      ipAddress?: string;
      userAgent?: string;
    } = {
      id: data.id as string,
      userId: data.user_id as string,
      otpType: data.otp_type as 'email' | 'password_reset',
      contactInfo: data.contact_info as string,
      otpCode: data.otp_code as string,
      ipAddress: data.ip_address as string | undefined,
      userAgent: data.user_agent as string | undefined
    };
    
    const otp = new OTPToken(otpData);
    
    // Use type assertion to access private properties for mapping
    const otpAny = otp as unknown as {
      _isVerified: boolean;
      _attempts: number;
      _maxAttempts: number;
      _createdAt: Date;
      _expiresAt: Date;
      _verifiedAt: Date | null;
    };
    
    otpAny._isVerified = (data.is_verified as boolean) || false;
    otpAny._attempts = (data.attempts as number) || 0;
    otpAny._maxAttempts = (data.max_attempts as number) || parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10);
    otpAny._createdAt = data.created_at ? new Date(data.created_at as string) : new Date();
    otpAny._expiresAt = data.expires_at ? new Date(data.expires_at as string) : new Date();
    otpAny._verifiedAt = data.verified_at ? new Date(data.verified_at as string) : null;
    
    return otp;
  }

  async save(otp: OTPToken): Promise<OTPToken> {
    const redis = this.redisService.getClient();
    const otpData = otp.toJSON() as Record<string, unknown>;
    const expiresAt = otpData.expires_at instanceof Date 
      ? otpData.expires_at 
      : new Date(otpData.expires_at as string);
    const createdAt = otpData.created_at instanceof Date
      ? otpData.created_at
      : new Date(otpData.created_at as string);
    const now = new Date();
    const ttlSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
    const otpjson = JSON.stringify({
      ...otpData,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified_at: otpData.verified_at 
        ? (otpData.verified_at instanceof Date 
            ? otpData.verified_at.toISOString() 
            : new Date(otpData.verified_at as string).toISOString())
        : null,
      otp_type: otpData.otp_type
    });
    const userTypeKey = this.getKey(otpData.user_id as string, otpData.otp_type as 'email' | 'password_reset');
    const codeKey = this.getCodeKey(otpData.otp_code as string, otpData.contact_info as string);
    const otpKey = this.getOTPKey(otpData.id as string);
    const pipeline = redis.pipeline();
    await redis.del(userTypeKey);
    pipeline.setex(userTypeKey, ttlSeconds, otpjson);
    pipeline.setex(codeKey, ttlSeconds, otpData.id as string);
    pipeline.setex(otpKey, ttlSeconds, otpjson);
    await pipeline.exec();
    return otp;
  }

  async findByUserIdAndType(userId: string, otpType: 'email' | 'password_reset'): Promise<OTPToken | null> {
    const redis = this.redisService.getClient();
    const key = this.getKey(userId, otpType);
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    const otpData = JSON.parse(data) as Record<string, unknown>;
    return this.mapToOTP(otpData);
  }

  async findByCode(code: string, contactInfo: string): Promise<OTPToken | null> {
    const redis = this.redisService.getClient();
    const codeKey = this.getCodeKey(code, contactInfo);
    const otpId = await redis.get(codeKey);
    if (!otpId) {
      return null;
    }
    const otpKey = this.getOTPKey(otpId as string);
    const data = await redis.get(otpKey);
    if (!data) {
      return null;
    }
    const otpData = JSON.parse(data) as Record<string, unknown>;
    return this.mapToOTP(otpData);
  }

  async update(otp: OTPToken): Promise<OTPToken> {
    const redis = this.redisService.getClient();
    const otpData = otp.toJSON() as Record<string, unknown>;
    const otpKey = this.getOTPKey(otpData.id as string);
    const ttl = await redis.ttl(otpKey);
    if (ttl <= 0) {
      throw new NotFoundError('OTP has expired');
    }
    const createdAt = otpData.created_at instanceof Date
      ? otpData.created_at
      : new Date(otpData.created_at as string);
    const expiresAt = otpData.expires_at instanceof Date
      ? otpData.expires_at
      : new Date(otpData.expires_at as string);
    const otpjson = JSON.stringify({
      ...otpData,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified_at: otpData.verified_at 
        ? (otpData.verified_at instanceof Date 
            ? otpData.verified_at.toISOString() 
            : new Date(otpData.verified_at as string).toISOString())
        : null
    });
    const userTypeKey = this.getKey(otpData.user_id as string, otpData.otp_type as 'email' | 'password_reset');
    const codeKey = this.getCodeKey(otpData.otp_code as string, otpData.contact_info as string);
    const pipeline = redis.pipeline();
    pipeline.setex(otpKey, ttl, otpjson);
    pipeline.setex(userTypeKey, ttl, otpjson);
    pipeline.setex(codeKey, ttl, otpData.id as string);
    await pipeline.exec();
    return otp;
  }

  async deleteExpiredTokens(): Promise<void> {
    console.log('Redis TTL: Relying on Redis TTL for automatic key deletion');
  }

  async deleteById(id: string): Promise<void> {
    const redis = this.redisService.getClient();
    const otpKey = this.getOTPKey(id);
    
    // Get OTP data first to delete all related keys
    const data = await redis.get(otpKey);
    if (data) {
      const otpData = JSON.parse(data) as Record<string, unknown>;
      const userTypeKey = this.getKey(otpData.user_id as string, otpData.otp_type as 'email' | 'password_reset');
      const codeKey = this.getCodeKey(otpData.otp_code as string, otpData.contact_info as string);
      
      // Delete all keys related to this OTP
      const pipeline = redis.pipeline();
      pipeline.del(otpKey);
      pipeline.del(userTypeKey);
      pipeline.del(codeKey);
      await pipeline.exec();
    } else {
      // If OTP key doesn't exist, just try to delete it anyway
      await redis.del(otpKey);
    }
  }
}