/**
 * Base class for Redis-based repositories
 * Provides common functionality for repositories that use Redis instead of Prisma
 */
export declare abstract class BaseRedisRepository {
    /**
     * Base class for Redis repositories
     * Note: Redis repositories don't extend BaseRepository because they don't use Prisma
     * This class provides a common structure for Redis-based data access
     */
    protected constructor();
    /**
     * Common helper method for generating Redis keys
     * Subclasses should implement their own key generation logic
     */
    protected abstract getKeyPrefix(): string;
}
//# sourceMappingURL=BaseRedisRepository.d.ts.map