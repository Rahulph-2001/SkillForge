

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

export interface DeclineRescheduleRequest {
  bookingId: string;
  providerId: string;
  reason: string;
}

export interface DeclineRescheduleResponse {
  success: boolean;
  message: string;
}

@injectable()
export class DeclineRescheduleUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: DeclineRescheduleRequest): Promise<DeclineRescheduleResponse> {
    try {
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
          message: 'Unauthorized to decline this reschedule request',
        };
      }

      // 3. Verify booking has a reschedule request
      if (!booking.isRescheduleRequest()) {
        return {
          success: false,
          message: 'No reschedule request found for this booking',
        };
      }

      // 4. Decline the reschedule request (revert to confirmed status and clear reschedule info)
      await this.bookingRepository.declineReschedule(request.bookingId, request.reason);

      // TODO: Send notification to learner about declined reschedule

      return {
        success: true,
        message: 'Reschedule request declined',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to decline reschedule request',
      };
    }
  }
}
