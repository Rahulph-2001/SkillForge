
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';
import { ICompleteSessionUseCase, CompleteSessionRequestDTO } from './interfaces/ICompleteSessionUseCase';

@injectable()
export class CompleteSessionUseCase implements ICompleteSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper,
    ) { }

    async execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO> {
        const { bookingId, completedBy } = request;

        const booking = await this.bookingRepository.findById(bookingId)
        if (!booking) {
            throw new NotFoundError('Booking not found')
        }

        if (booking.providerId !== completedBy && booking.learnerId !== completedBy) {
            throw new ForbiddenError('You are not authorized to complete this session')
        }

        if (!booking.canBeCompleted()) {
            throw new ValidationError(`cannot complete booking with status: ${booking.status}`)
        }

        await this.escrowRepository.releaseCredits(bookingId)

        const updatedBooking = await this.bookingRepository.updateStatus(
            bookingId,
            BookingStatus.COMPLETED
        )
        return this.bookingMapper.toDTO(updatedBooking)
    }
}