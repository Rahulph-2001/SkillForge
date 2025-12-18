"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../../config/env");
class RedisService {
    constructor() {
        const redisUrl = env_1.env.REDIS_URL;
        const redisPassword = env_1.env.REDIS_PASSWORD;
        if (redisUrl) {
            const redisOptions = {
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            };
            if (redisPassword && !redisUrl.includes('@')) {
                redisOptions.password = redisPassword;
            }
            this.redis = new ioredis_1.default(redisUrl, redisOptions);
        }
        else {
            const redisHost = 'localhost';
            const redisPort = 6379;
            this.redis = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                password: redisPassword,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            });
        }
        this.redis.on('connect', () => {
            console.log('Redis connected');
        });
        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });
        this.redis.on('close', () => {
            console.log('Redis connection closed');
        });
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    getClient() {
        return this.redis;
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            await this.redis.setex(key, ttlSeconds, value);
        }
        else {
            this.redis.set(key, value);
        }
    }
    async get(key) {
        return this.redis.get(key);
    }
    async delete(key) {
        this.redis.del(key);
    }
    async exists(key) {
        const result = await this.redis.exists(key);
        return result === 1;
    }
    async expire(key, seconds) {
        this.redis.expire(key, seconds);
    }
    async getTTL(key) {
        return this.redis.ttl(key);
    }
    async increment(key) {
        return this.redis.incr(key);
    }
    async close() {
        this.redis.quit();
    }
    async ping() {
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        }
        catch (error) {
            return false;
        }
    }
    getRedisOptions() {
        const redisUrl = env_1.env.REDIS_URL;
        const redisPassword = env_1.env.REDIS_PASSWORD;
        if (redisUrl) {
            return {
                connection: {
                    url: redisUrl,
                    password: redisPassword
                }
            };
        }
        else {
            return {
                connection: {
                    host: 'localhost',
                    port: 6379,
                    password: redisPassword
                }
            };
        }
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=RedisService.js.map