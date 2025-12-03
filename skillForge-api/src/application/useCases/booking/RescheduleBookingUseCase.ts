

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { RescheduleInfo } from '../../../domain/entities/Booking';

export interface RescheduleBookingRequest {
  bookingId: string;
  userId: string;
  newDate: string;
  newTime: string;
  reason: string;
}

export interface RescheduleBookingResponse {
  success: boolean;
  message: string;
}

@injectable()
export class RescheduleBookingUseCase {
  constructor(
    @inject(TYPES.BookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: RescheduleBookingRequest): Promise<RescheduleBookingResponse> {
    try {
      console.log('🟡 [RescheduleBookingUseCase] Executing reschedule request:', request);

      // 1. Get the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        return {
          success: false,
          message: 'Booking not found',
        };
      }

      // 2. Verify authorization (User must be learner or provider)
      const isLearner = booking.learnerId === request.userId;
      const isProvider = booking.providerId === request.userId;

      if (!isLearner && !isProvider) {
        return {
          success: false,
          message: 'Unauthorized to reschedule this booking',
        };
      }

      // 3. Verify booking can be rescheduled
      if (!booking.canBeRescheduled()) {
        return {
          success: false,
          message: `Cannot reschedule booking with status: ${booking.status}`,
        };
      }

      // 4. Validate new date is in the future
      const newDateTime = new Date(`${request.newDate}T${request.newTime}`);
      if (newDateTime <= new Date()) {
        return {
          success: false,
          message: 'Reschedule date must be in the future',
        };
      }

      // 5. Create reschedule info
      const rescheduleInfo: RescheduleInfo = {
        newDate: request.newDate,
        newTime: request.newTime,
        reason: request.reason,
        requestedBy: isLearner ? 'learner' : 'provider',
        requestedAt: new Date(),
      };

      // 6. Update booking with reschedule request
      await this.bookingRepository.updateWithReschedule(request.bookingId, rescheduleInfo);

      console.log('✅ [RescheduleBookingUseCase] Reschedule requested successfully');

      return {
        success: true,
        message: 'Reschedule request submitted successfully. Waiting for approval.',
      };
    } catch (error: any) {
      console.error('❌ [RescheduleBookingUseCase] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to request reschedule',
      };
    }
  }
}
