import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { IReviewMapper } from '../../mappers/ReviewMapper';
import { ICreateReviewUseCase } from './interfaces/ICreateReviewUseCase';
import { CreateReviewDTO, ReviewResponseDTO } from '../../dto/review/CreateReviewDTO';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { BookingStatus } from '../../../domain/entities/Booking';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Review, CreateReviewProps } from '../../../domain/entities/Review';
import { Database } from '../../../infrastructure/database/Database';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient } from '@prisma/client';
import { ISocketNotificationService } from '../../../domain/services/ISocketNotificationService';
import { IVideoCallRoomRepository } from '../../../domain/repositories/IVideoCallRoomRepository';

@injectable()
export class CreateReviewUseCase implements ICreateReviewUseCase {
    constructor(
        @inject(TYPES.IReviewRepository) private reviewRepository: IReviewRepository,
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IReviewMapper) private reviewMapper: IReviewMapper,
        @inject(TYPES.Database) private db: Database,
        @inject(TYPES.ISocketNotificationService) private socketNotificationService: ISocketNotificationService,
        @inject(TYPES.IVideoCallRoomRepository) private videoCallRoomRepository: IVideoCallRoomRepository
    ) { }

    async execute(userId: string, request: CreateReviewDTO): Promise<ReviewResponseDTO> {
        const { bookingId, rating, review } = request;

        // 1. Validate Booking
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }

        // 2. Validate User is the Learner
        if (booking.learnerId !== userId) {
            throw new ForbiddenError('Only the learner can submit a review for this session');
        }

        // 3. Validate Booking Status (Must be Completed)
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new ValidationError('Cannot review a session that is not completed');
        }

        // 4. Check if review already exists
        const existingReview = await this.reviewRepository.findByBookingId(bookingId);
        if (existingReview) {
            throw new ValidationError('Review already submitted for this session');
        }


        // 5. Create Review Entity
        const reviewEntity = new Review({
            bookingId,
            providerId: booking.providerId,
            learnerId: booking.learnerId,
            skillId: booking.skillId,
            rating,
            review,
        });



        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdReview = await (this.reviewRepository as any).createWithStats(reviewEntity);

        // CRITICAL: After review is submitted, end the video call for ALL participants
        // This broadcasts video:room-ended to the provider so their call drops
        const videoRoom = await this.videoCallRoomRepository.findByBookingId(bookingId);
        if (videoRoom && videoRoom.status !== 'ended') {
            await this.videoCallRoomRepository.updateStatus(videoRoom.id, 'ended', new Date());
            this.socketNotificationService.notifyRoomEnded(videoRoom.id);
        }

        return this.reviewMapper.toResponseDTO(createdReview);
    }
}
