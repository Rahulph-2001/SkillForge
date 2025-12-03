/**
 * Accept Reschedule Use Case
 * Handles logic for accepting a reschedule request
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

export interface AcceptRescheduleRequest {
  bookingId: string;
  providerId: string;
}

export interface AcceptRescheduleResponse {
  success: boolean;
  message: string;
}

@injectable()
export class AcceptRescheduleUseCase {
  constructor(
    @inject(TYPES.BookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: AcceptRescheduleRequest): Promise<AcceptRescheduleResponse> {
    try {
      console.log('🟡 [AcceptRescheduleUseCase] Executing accept reschedule:', request);

      // 1. Get the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
        };
      }

      // 2. Verify authorization (Must be the provider)
      if (booking.providerId !== request.providerId) {
        return {
          success: false,
          message: 'Unauthorized to accept this reschedule request',
        };
      }

      // 3. Verify booking has a reschedule request
      if (!booking.isRescheduleRequest()) {
        return {
          success: false,
          message: 'No reschedule request found for this booking',
        };
      }

      // 4. Get reschedule info
      const rescheduleInfo = booking.rescheduleInfo;
      if (!rescheduleInfo) {
        return {
          success: false,
          message: 'Reschedule information not found',
        };
      }

      // 5. Update booking with new date/time and set status to confirmed
      // We need to update the booking's preferred date and time
      await this.bookingRepository.acceptReschedule(
        request.bookingId,
        rescheduleInfo.newDate,
        rescheduleInfo.newTime
      );

      console.log('✅ [AcceptRescheduleUseCase] Reschedule accepted successfully');

      // TODO: Send notification to learner about accepted reschedule

      return {
        success: true,
        message: 'Reschedule request accepted successfully',
      };
    } catch (error: any) {
      console.error('❌ [AcceptRescheduleUseCase] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept reschedule request',
      };
    }
  }
}
