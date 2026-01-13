"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRedisRepository = void 0;
/**
 * Base class for Redis-based repositories
 * Provides common functionality for repositories that use Redis instead of Prisma
 */
class BaseRedisRepository {
    /**
     * Base class for Redis repositories
     * Note: Redis repositories don't extend BaseRepository because they don't use Prisma
     * This class provides a common structure for Redis-based data access
     */
    constructor() {
        // Base constructor - subclasses should inject RedisService
    }
}
exports.BaseRedisRepository = BaseRedisRepository;
//# sourceMappingURL=BaseRedisRepository.js.map