/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';

export interface DeclineBookingRequest {
  bookingId: string;
  providerId: string;
  reason?: string;
}

export interface DeclineBookingResponse {
  success: boolean;
  message: string;
}

@injectable()
export class DeclineBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: DeclineBookingRequest): Promise<DeclineBookingResponse> {
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
          message: 'Unauthorized: You can only decline your own bookings',
        };
      }

      // 3. Check if booking can be rejected
      if (!booking.canBeRejected()) {
        return {
          success: false,
          message: `Cannot decline booking with status: ${booking.status}`,
        };
      }

      // 4. Update booking status to rejected
      await this.bookingRepository.updateStatus(request.bookingId, BookingStatus.REJECTED, request.reason);

      // TODO: Refund credits to learner
      // TODO: Send notification to learner
      // TODO: Update provider statistics

      return {
        success: true,
        message: 'Booking declined successfully',
      };
    } catch (error: any) {
      console.error('[DeclineBookingUseCase] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to decline booking',
      };
    }
  }
}
