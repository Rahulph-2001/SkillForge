import { CreateReviewDTO, ReviewResponseDTO } from '../../../dto/review/CreateReviewDTO';
export interface ICreateReviewUseCase {
    execute(userId: string, request: CreateReviewDTO): Promise<ReviewResponseDTO>;
}
//# sourceMappingURL=ICreateReviewUseCase.d.ts.map