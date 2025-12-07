"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetLimiter = exports.otpLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const RedisService_1 = require("../../infrastructure/services/RedisService");
const env_1 = require("../../config/env");
function createRedisStore(windowMs = 15 * 60 * 1000, prefix = 'rl') {
    const redis = RedisService_1.RedisService.getInstance().getClient();
    const incrementScript = `
    local key = KEYS[1]
    local ttl = tonumber(ARGV[1])
    local count = redis.call('INCR', key)
    if count == 1 then
      redis.call('EXPIRE', key, ttl)
    end
    return count
  `;
    return {
        async increment(key, options) {
            const effectiveWindowMs = options?.windowMs ?? windowMs;
            const ttlSeconds = Math.ceil(effectiveWindowMs / 1000);
            const redisKey = `${prefix}:${key}`;
            try {
                // Use Lua script for atomic operation to prevent double counting
                const count = await redis.eval(incrementScript, 1, redisKey, ttlSeconds.toString());
                return {
                    totalHits: count,
                    resetTime: new Date(Date.now() + effectiveWindowMs),
                };
            }
            catch (error) {
                // Fallback to non-atomic operation if script fails
                console.error('Redis Lua script error, falling back:', error);
                const count = await redis.incr(redisKey);
                if (count === 1) {
                    await redis.expire(redisKey, ttlSeconds);
                }
                return {
                    totalHits: count,
                    resetTime: new Date(Date.now() + effectiveWindowMs),
                };
            }
        },
        async decrement(key) {
            try {
                await redis.decr(`${prefix}:${key}`);
            }
            catch {
                // ignore
            }
        },
        async resetKey(key) {
            try {
                await redis.del(`${prefix}:${key}`);
            }
            catch {
                // ignore
            }
        },
        async resetAll() {
        },
    };
}
const baseOptions = {
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        trustProxy: false,
        xForwardedForHeader: false,
    },
};
const useRedis = Boolean(env_1.env.REDIS_URL || env_1.env.REDIS_HOST);
const generalWindowMs = env_1.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000;
// Increase default max requests for development
const defaultMax = process.env.NODE_ENV === 'development' ? 5000 : 100;
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: generalWindowMs,
    max: env_1.env.RATE_LIMIT_MAX_REQUESTS || defaultMax,
    message: {
        success: false,
        error: 'Too many requests, try again later.',
    },
    ...baseOptions,
    store: useRedis ? createRedisStore(generalWindowMs, 'rl:gen') : undefined,
});
const authWindowMs = env_1.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000;
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: authWindowMs,
    max: env_1.env.AUTH_RATE_LIMIT_MAX_REQUESTS || defaultMax,
    message: {
        success: false,
        error: 'Too many auth attempts, try again in 15 minutes.',
    },
    skipSuccessfulRequests: true,
    skipFailedRequests: true, // Don't count failed requests (validation errors, etc.)
    ...baseOptions,
    store: useRedis ? createRedisStore(authWindowMs, 'rl:auth') : undefined,
});
const otpWindowMs = env_1.env.OTP_RATE_LIMIT_WINDOW_MS;
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: otpWindowMs,
    max: env_1.env.OTP_RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many OTP requests, try again later.',
    },
    skipSuccessfulRequests: true,
    skipFailedRequests: true, // Don't count failed requests (validation errors, etc.)
    ...baseOptions,
    store: useRedis ? createRedisStore(otpWindowMs, 'rl:otp') : undefined,
});
const pwWindowMs = env_1.env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS;
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: pwWindowMs,
    max: env_1.env.PASSWORD_RESET_RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many password reset requests, try again later.',
    },
    skipSuccessfulRequests: true,
    ...baseOptions,
    store: useRedis ? createRedisStore(pwWindowMs, 'rl:pw') : undefined,
});
//# sourceMappingURL=rateLimitMiddileWare.js.map