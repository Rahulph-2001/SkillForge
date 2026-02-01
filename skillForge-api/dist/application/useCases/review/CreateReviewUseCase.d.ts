import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { IReviewMapper } from '../../mappers/ReviewMapper';
import { ICreateReviewUseCase } from './interfaces/ICreateReviewUseCase';
import { CreateReviewDTO, ReviewResponseDTO } from '../../dto/review/CreateReviewDTO';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Database } from '../../../infrastructure/database/Database';
export declare class CreateReviewUseCase implements ICreateReviewUseCase {
    private reviewRepository;
    private bookingRepository;
    private reviewMapper;
    private db;
    constructor(reviewRepository: IReviewRepository, bookingRepository: IBookingRepository, reviewMapper: IReviewMapper, db: Database);
    execute(userId: string, request: CreateReviewDTO): Promise<ReviewResponseDTO>;
}
//# sourceMappingURL=CreateReviewUseCase.d.ts.map