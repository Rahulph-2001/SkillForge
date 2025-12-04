

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingStatus } from '../../../domain/entities/Booking';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';

export interface AcceptBookingRequest {
  bookingId: string;
  providerId: string;
}

@injectable()
export class AcceptBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper
  ) {}

  async execute(request: AcceptBookingRequest): Promise<BookingResponseDTO> {
      // 1. Find the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // 2. Verify the provider owns this booking
      if (booking.providerId !== request.providerId) {
        throw new ForbiddenError('Unauthorized: You can only accept your own bookings');
      }

      // 3. Check if booking can be accepted
      if (!booking.canBeAccepted()) {
        throw new ValidationError(`Cannot accept booking with status: ${booking.status}`);
      }

      // 4. Update booking status to confirmed
      const updatedBooking = await this.bookingRepository.updateStatus(
        request.bookingId,
        BookingStatus.CONFIRMED
      );

      // TODO: Send notification to learner
      // TODO: Add to calendar
      // TODO: Update provider statistics

      return this.bookingMapper.toDTO(updatedBooking);
  }
}
