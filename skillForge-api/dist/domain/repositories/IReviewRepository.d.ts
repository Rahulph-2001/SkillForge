import { Review } from '../entities/Review';
export interface IReviewRepository {
    create(review: Review): Promise<Review>;
    findByBookingId(bookingId: string): Promise<Review | null>;
    findByProviderId(providerId: string): Promise<Review[]>;
    findByLearnerId(learnerId: string): Promise<Review[]>;
}
//# sourceMappingURL=IReviewRepository.d.ts.map