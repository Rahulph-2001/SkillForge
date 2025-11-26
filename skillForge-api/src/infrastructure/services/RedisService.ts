import Redis from 'ioredis';
import { env } from '../../config/env';

export class RedisService {
  private static instance: RedisService;
  private redis: Redis;

  private constructor() {
    const redisUrl = env.REDIS_URL;
    const redisPassword = env.REDIS_PASSWORD;
    if (redisUrl) {
      const redisOptions: {
        retryStrategy: (times: number) => number;
        maxRetriesPerRequest: number;
        password?: string;
      } = {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      };

      if (redisPassword && !redisUrl.includes('@')) {
        redisOptions.password = redisPassword;
      }
      this.redis = new Redis(redisUrl, redisOptions);
    } else {
      const redisHost = 'localhost';
      const redisPort = 6379;
      this.redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        retryStrategy: (times: number) => {
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

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public getClient(): Redis {
    return this.redis;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, value);
    } else {
      this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async delete(key: string): Promise<void> {
    this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    this.redis.expire(key, seconds);
  }

  async getTTL(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async close(): Promise<void> {
    this.redis.quit();
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      return false;
    }
  }
}