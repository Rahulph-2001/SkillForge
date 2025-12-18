

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';

export interface DeclineRescheduleRequest {
  bookingId: string;
  userId: string; // Can be either provider or learner
  reason: string;
}

@injectable()
export class DeclineRescheduleUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: DeclineRescheduleRequest): Promise<void> {
    // 1. Get the booking
    const booking = await this.bookingRepository.findById(request.bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 2. Verify booking has a reschedule request
    if (!booking.isRescheduleRequest()) {
      throw new ValidationError('No reschedule request found for this booking');
    }

    // 3. Get reschedule info
    const rescheduleInfo = booking.rescheduleInfo;
    if (!rescheduleInfo) {
      throw new ValidationError('Reschedule information not found');
    }

    // 4. Verify authorization - The person who DIDN'T request the reschedule should decline it
    const isLearner = booking.learnerId === request.userId;
    const isProvider = booking.providerId === request.userId;

    if (!isLearner && !isProvider) {
      throw new ForbiddenError('Unauthorized to decline this reschedule request');
    }

    // Check if the user is the one who should decline (not the one who requested)
    if (rescheduleInfo.requestedBy === 'learner' && !isProvider) {
      throw new ForbiddenError('Only the provider can decline a learner-initiated reschedule request');
    }

    if (rescheduleInfo.requestedBy === 'provider' && !isLearner) {
      throw new ForbiddenError('Only the learner can decline a provider-initiated reschedule request');
    }

    // 5. Decline the reschedule request (revert to confirmed status and clear reschedule info)
    await this.bookingRepository.declineReschedule(request.bookingId, request.reason);

    // TODO: Send notification to the requester about declined reschedule
  }
}
