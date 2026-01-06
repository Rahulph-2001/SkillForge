import rateLimit, {
  type Store,
  type IncrementResponse,
} from 'express-rate-limit';
import { RedisService } from '../../infrastructure/services/RedisService';
import { env } from '../../config/env';

function createRedisStore(windowMs: number = 15 * 60 * 1000, prefix: string = 'rl'): Store {
  const redis = RedisService.getInstance().getClient();
  

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
    async increment(
      key: string,
      options?: { windowMs?: number }
    ): Promise<IncrementResponse> {
      const effectiveWindowMs = options?.windowMs ?? windowMs;
      const ttlSeconds = Math.ceil(effectiveWindowMs / 1000);
      const redisKey = `${prefix}:${key}`;
      
      try {
        // Use Lua script for atomic operation to prevent double counting
        const count = await redis.eval(incrementScript, 1, redisKey, ttlSeconds.toString()) as number;
        
        return {
          totalHits: count,
          resetTime: new Date(Date.now() + effectiveWindowMs),
        };
      } catch (error) {
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
    async decrement(key: string) {
      try {
        await redis.decr(`${prefix}:${key}`);
      } catch {
        // ignore
      }
    },
    async resetKey(key: string) {
      try {
        await redis.del(`${prefix}:${key}`);
      } catch {
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

const useRedis = Boolean(env.REDIS_URL || env.REDIS_HOST);
const generalWindowMs = env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000;

// Increase default max requests for development
const defaultMax = process.env.NODE_ENV === 'development' ? 5000 : 100;

export const generalLimiter = rateLimit({
  windowMs: generalWindowMs,
  max: env.RATE_LIMIT_MAX_REQUESTS || defaultMax,
  message: {
    success: false,
    error: 'Too many requests, try again later.',
  },
  ...baseOptions,
  store: useRedis ? createRedisStore(generalWindowMs, 'rl:gen') : undefined,
});

const authWindowMs = env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000;
export const authLimiter = rateLimit({
  windowMs: authWindowMs,
  max: env.AUTH_RATE_LIMIT_MAX_REQUESTS || defaultMax,
  message: {
    success: false,
    error: 'Too many auth attempts, try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
  skipFailedRequests: true, // Don't count failed requests (validation errors, etc.)
  ...baseOptions,
  store: useRedis ? createRedisStore(authWindowMs, 'rl:auth') : undefined,
});

const otpWindowMs = env.OTP_RATE_LIMIT_WINDOW_MS;
export const otpLimiter = rateLimit({
  windowMs: otpWindowMs,
  max: env.OTP_RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many OTP requests, try again later.',
  },
  skipSuccessfulRequests: true,
  skipFailedRequests: true, // Don't count failed requests (validation errors, etc.)
  ...baseOptions,
  store: useRedis ? createRedisStore(otpWindowMs, 'rl:otp') : undefined,
});

const pwWindowMs = env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS;
export const passwordResetLimiter = rateLimit({
  windowMs: pwWindowMs,
  max: env.PASSWORD_RESET_RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many password reset requests, try again later.',
  },
  skipSuccessfulRequests: true,
  ...baseOptions,
  store: useRedis ? createRedisStore(pwWindowMs, 'rl:pw') : undefined,
});

