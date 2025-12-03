/**
 * Accept Booking Use Case
 * Handles the business logic for accepting a booking request
 * Following Single Responsibility Principle
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';

export interface AcceptBookingRequest {
  bookingId: string;
  providerId: string;
}

export interface AcceptBookingResponse {
  success: boolean;
  message: string;
  booking?: any;
}

@injectable()
export class AcceptBookingUseCase {
  constructor(
    @inject(TYPES.BookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: AcceptBookingRequest): Promise<AcceptBookingResponse> {
    try {
      // 1. Find the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
        };
      }

      // 2. Verify the provider owns this booking
      if (booking.providerId !== request.providerId) {
        return {
          success: false,
          message: 'Unauthorized: You can only accept your own bookings',
        };
      }

      // 3. Check if booking can be accepted
      if (!booking.canBeAccepted()) {
        return {
          success: false,
          message: `Cannot accept booking with status: ${booking.status}`,
        };
      }

      // 4. Update booking status to confirmed
      const updatedBooking = await this.bookingRepository.updateStatus(
        request.bookingId,
        BookingStatus.CONFIRMED
      );

      // TODO: Send notification to learner
      // TODO: Add to calendar
      // TODO: Update provider statistics

      return {
        success: true,
        message: 'Booking accepted successfully',
        booking: updatedBooking.toObject(),
      };
    } catch (error: any) {
      console.error('[AcceptBookingUseCase] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept booking',
      };
    }
  }
}
