import Redis from 'ioredis';
export declare class RedisService {
    private static instance;
    private redis;
    private constructor();
    static getInstance(): RedisService;
    getClient(): Redis;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    expire(key: string, seconds: number): Promise<void>;
    getTTL(key: string): Promise<number>;
    increment(key: string): Promise<number>;
    close(): Promise<void>;
    ping(): Promise<boolean>;
    getRedisOptions(): any;
}
//# sourceMappingURL=RedisService.d.ts.map