import { RedisService } from '../../services/RedisService';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { OTPToken } from '../../../domain/entities/OTPToken';
import { BaseRedisRepository } from '../BaseRedisRepository';
export declare class RedisOTPRepository extends BaseRedisRepository implements IOTPRepository {
    private redisService;
    private readonly OTP_PREFIX;
    private readonly OTP_USER_PREFIX;
    private readonly OTP_CODE_PREFIX;
    constructor(redisService: RedisService);
    protected getKeyPrefix(): string;
    private getKey;
    private getCodeKey;
    private getOTPKey;
    private mapToOTP;
    save(otp: OTPToken): Promise<OTPToken>;
    findByUserIdAndType(userId: string, otpType: 'email' | 'password_reset'): Promise<OTPToken | null>;
    findByCode(code: string, contactInfo: string): Promise<OTPToken | null>;
    update(otp: OTPToken): Promise<OTPToken>;
    deleteExpiredTokens(): Promise<void>;
    deleteById(id: string): Promise<void>;
}
//# sourceMappingURL=RedisOTPRepository.d.ts.map