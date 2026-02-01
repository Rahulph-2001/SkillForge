import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { Review } from '../../../domain/entities/Review';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class ReviewRepository extends BaseRepository<Review> implements IReviewRepository {
    constructor(db: Database);
    private mapToDomain;
    create(review: Review): Promise<Review>;
    createWithStats(review: Review): Promise<Review>;
    findByBookingId(bookingId: string): Promise<Review | null>;
    findByProviderId(providerId: string): Promise<Review[]>;
    findByLearnerId(learnerId: string): Promise<Review[]>;
}
//# sourceMappingURL=ReviewRepository.d.ts.map