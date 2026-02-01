import { Review } from '../../domain/entities/Review';
import { ReviewResponseDTO } from '../dto/review/CreateReviewDTO';
export interface IReviewMapper {
    toResponseDTO(review: Review): ReviewResponseDTO;
}
export declare class ReviewMapper implements IReviewMapper {
    toResponseDTO(review: Review): ReviewResponseDTO;
}
//# sourceMappingURL=ReviewMapper.d.ts.map