/**
 * Cancel Booking Use Case
 * Handles logic for cancelling a booking
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

export interface CancelBookingRequest {
  bookingId: string;
  userId: string;
  reason?: string;
}

export interface CancelBookingResponse {
  success: boolean;
  message: string;
}

@injectable()
export class CancelBookingUseCase {
  constructor(
    @inject(TYPES.BookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: CancelBookingRequest): Promise<CancelBookingResponse> {
    try {
      console.log('🟡 [CancelBookingUseCase] Executing cancellation:', request);

      // 1. Get the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
        };
      }

      // 2. Verify authorization (User must be learner or provider)
      if (booking.learnerId !== request.userId && booking.providerId !== request.userId) {
        return {
          success: false,
          message: 'Unauthorized to cancel this booking',
        };
      }

      // 3. Verify booking can be cancelled using domain logic
      if (!booking.canBeCancelled()) {
        return {
          success: false,
          message: `Cannot cancel booking with status: ${booking.status}`,
        };
      }

      // 4. Cancel the booking with metadata
      await this.bookingRepository.cancel(
        request.bookingId,
        request.userId,
        request.reason || 'No reason provided'
      );

      console.log('✅ [CancelBookingUseCase] Booking cancelled successfully');

      // TODO: Trigger refund logic if payment was made
      // TODO: Send notification to other party

      return {
        success: true,
        message: 'Booking cancelled successfully',
      };
    } catch (error: any) {
      console.error('❌ [CancelBookingUseCase] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to cancel booking',
      };
    }
  }
}
