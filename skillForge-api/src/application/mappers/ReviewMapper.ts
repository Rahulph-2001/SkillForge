import { injectable } from 'inversify';
import { Review } from '../../domain/entities/Review';
import { ReviewResponseDTO } from '../dto/review/CreateReviewDTO';

export interface IReviewMapper {
    toResponseDTO(review: Review): ReviewResponseDTO;
}

@injectable()
export class ReviewMapper implements IReviewMapper {
    public toResponseDTO(review: Review): ReviewResponseDTO {
        return {
            id: review.id,
            bookingId: review.bookingId,
            providerId: review.providerId,
            learnerId: review.learnerId,
            skillId: review.skillId,
            rating: review.rating,
            review: review.review,
            createdAt: review.createdAt,
        };
    }
}
