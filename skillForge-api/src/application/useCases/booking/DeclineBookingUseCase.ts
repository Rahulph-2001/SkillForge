/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle and Clean Architecture
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';

export interface DeclineBookingRequest {
  bookingId: string;
  providerId: string;
  reason?: string;
}

@injectable()
export class DeclineBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: DeclineBookingRequest): Promise<void> {
    // 1. Find the booking
    const booking = await this.bookingRepository.findById(request.bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 2. Verify the provider owns this booking
    if (booking.providerId !== request.providerId) {
      throw new ForbiddenError('Unauthorized: You can only decline your own bookings');
    }

    // 3. Check if booking can be rejected
    if (!booking.canBeRejected()) {
      throw new ValidationError(`Cannot decline booking with status: ${booking.status}`);
    }

    // 4. Update booking status to rejected
    // Note: Credit refund to learner is handled automatically by updateStatus transactional method
    await this.bookingRepository.updateStatus(
      request.bookingId,
      BookingStatus.REJECTED,
      request.reason
    );

    // TODO: Send notification to learner
    // TODO: Update provider statistics
  }
}
