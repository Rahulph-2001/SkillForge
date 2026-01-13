"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisOTPRepository = void 0;
const inversify_1 = require("inversify");
const RedisService_1 = require("../../services/RedisService");
const OTPToken_1 = require("../../../domain/entities/OTPToken");
const types_1 = require("../../di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const BaseRedisRepository_1 = require("../BaseRedisRepository");
let RedisOTPRepository = class RedisOTPRepository extends BaseRedisRepository_1.BaseRedisRepository {
    constructor(redisService) {
        super();
        this.redisService = redisService;
        this.OTP_PREFIX = 'otp:';
        this.OTP_USER_PREFIX = 'otp:user:';
        this.OTP_CODE_PREFIX = 'otp:code:';
    }
    getKeyPrefix() {
        return this.OTP_PREFIX;
    }
    getKey(userId, otpType) {
        return `${this.OTP_USER_PREFIX}${userId}:${otpType}`;
    }
    getCodeKey(code, contactInfo) {
        return `${this.OTP_CODE_PREFIX}${code}:${contactInfo}`;
    }
    getOTPKey(otpId) {
        return `${this.OTP_PREFIX}${otpId}`;
    }
    mapToOTP(data) {
        const otpData = {
            id: data.id,
            userId: data.user_id,
            otpType: data.otp_type,
            contactInfo: data.contact_info,
            otpCode: data.otp_code,
            ipAddress: data.ip_address,
            userAgent: data.user_agent
        };
        const otp = new OTPToken_1.OTPToken(otpData);
        // Use type assertion to access private properties for mapping
        const otpAny = otp;
        otpAny._isVerified = data.is_verified || false;
        otpAny._attempts = data.attempts || 0;
        otpAny._maxAttempts = data.max_attempts || parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10);
        otpAny._createdAt = data.created_at ? new Date(data.created_at) : new Date();
        otpAny._expiresAt = data.expires_at ? new Date(data.expires_at) : new Date();
        otpAny._verifiedAt = data.verified_at ? new Date(data.verified_at) : null;
        return otp;
    }
    async save(otp) {
        const redis = this.redisService.getClient();
        const otpData = otp.toJSON();
        const expiresAt = otpData.expires_at instanceof Date
            ? otpData.expires_at
            : new Date(otpData.expires_at);
        const createdAt = otpData.created_at instanceof Date
            ? otpData.created_at
            : new Date(otpData.created_at);
        const now = new Date();
        const ttlSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        const otpjson = JSON.stringify({
            ...otpData,
            created_at: createdAt.toISOString(),
            expires_at: expiresAt.toISOString(),
            verified_at: otpData.verified_at
                ? (otpData.verified_at instanceof Date
                    ? otpData.verified_at.toISOString()
                    : new Date(otpData.verified_at).toISOString())
                : null,
            otp_type: otpData.otp_type
        });
        const userTypeKey = this.getKey(otpData.user_id, otpData.otp_type);
        const codeKey = this.getCodeKey(otpData.otp_code, otpData.contact_info);
        const otpKey = this.getOTPKey(otpData.id);
        const pipeline = redis.pipeline();
        await redis.del(userTypeKey);
        pipeline.setex(userTypeKey, ttlSeconds, otpjson);
        pipeline.setex(codeKey, ttlSeconds, otpData.id);
        pipeline.setex(otpKey, ttlSeconds, otpjson);
        await pipeline.exec();
        return otp;
    }
    async findByUserIdAndType(userId, otpType) {
        const redis = this.redisService.getClient();
        const key = this.getKey(userId, otpType);
        const data = await redis.get(key);
        if (!data) {
            return null;
        }
        const otpData = JSON.parse(data);
        return this.mapToOTP(otpData);
    }
    async findByCode(code, contactInfo) {
        const redis = this.redisService.getClient();
        const codeKey = this.getCodeKey(code, contactInfo);
        const otpId = await redis.get(codeKey);
        if (!otpId) {
            return null;
        }
        const otpKey = this.getOTPKey(otpId);
        const data = await redis.get(otpKey);
        if (!data) {
            return null;
        }
        const otpData = JSON.parse(data);
        return this.mapToOTP(otpData);
    }
    async update(otp) {
        const redis = this.redisService.getClient();
        const otpData = otp.toJSON();
        const otpKey = this.getOTPKey(otpData.id);
        const ttl = await redis.ttl(otpKey);
        if (ttl <= 0) {
            throw new AppError_1.NotFoundError('OTP has expired');
        }
        const createdAt = otpData.created_at instanceof Date
            ? otpData.created_at
            : new Date(otpData.created_at);
        const expiresAt = otpData.expires_at instanceof Date
            ? otpData.expires_at
            : new Date(otpData.expires_at);
        const otpjson = JSON.stringify({
            ...otpData,
            created_at: createdAt.toISOString(),
            expires_at: expiresAt.toISOString(),
            verified_at: otpData.verified_at
                ? (otpData.verified_at instanceof Date
                    ? otpData.verified_at.toISOString()
                    : new Date(otpData.verified_at).toISOString())
                : null
        });
        const userTypeKey = this.getKey(otpData.user_id, otpData.otp_type);
        const codeKey = this.getCodeKey(otpData.otp_code, otpData.contact_info);
        const pipeline = redis.pipeline();
        pipeline.setex(otpKey, ttl, otpjson);
        pipeline.setex(userTypeKey, ttl, otpjson);
        pipeline.setex(codeKey, ttl, otpData.id);
        await pipeline.exec();
        return otp;
    }
    async deleteExpiredTokens() {
        console.log('Redis TTL: Relying on Redis TTL for automatic key deletion');
    }
    async deleteById(id) {
        const redis = this.redisService.getClient();
        const otpKey = this.getOTPKey(id);
        // Get OTP data first to delete all related keys
        const data = await redis.get(otpKey);
        if (data) {
            const otpData = JSON.parse(data);
            const userTypeKey = this.getKey(otpData.user_id, otpData.otp_type);
            const codeKey = this.getCodeKey(otpData.otp_code, otpData.contact_info);
            // Delete all keys related to this OTP
            const pipeline = redis.pipeline();
            pipeline.del(otpKey);
            pipeline.del(userTypeKey);
            pipeline.del(codeKey);
            await pipeline.exec();
        }
        else {
            // If OTP key doesn't exist, just try to delete it anyway
            await redis.del(otpKey);
        }
    }
};
exports.RedisOTPRepository = RedisOTPRepository;
exports.RedisOTPRepository = RedisOTPRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [RedisService_1.RedisService])
], RedisOTPRepository);
//# sourceMappingURL=RedisOTPRepository.js.map