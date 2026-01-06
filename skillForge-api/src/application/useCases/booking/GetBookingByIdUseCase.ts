import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetBookingByIdUseCase } from './interfaces/IGetBookingByIdUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class GetBookingByIdUseCase implements IGetBookingByIdUseCase {
  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper
  ) {}

  async execute(bookingId: string, userId: string): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.learnerId !== userId && booking.providerId !== userId) {
      throw new ForbiddenError('Unauthorized to view this booking');
    }

    return this.bookingMapper.toDTO(booking);
  }
}

