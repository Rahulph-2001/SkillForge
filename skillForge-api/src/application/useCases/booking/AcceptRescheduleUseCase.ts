

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IAcceptRescheduleUseCase, AcceptRescheduleRequestDTO } from './interfaces/IAcceptRescheduleUseCase';

@injectable()
export class AcceptRescheduleUseCase implements IAcceptRescheduleUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: AcceptRescheduleRequestDTO): Promise<void> {
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

    // 4. Verify authorization - The person who DIDN'T request the reschedule should accept it
    // If learner requested, provider should accept. If provider requested, learner should accept.
    const isLearner = booking.learnerId === request.userId;
    const isProvider = booking.providerId === request.userId;

    if (!isLearner && !isProvider) {
      throw new ForbiddenError('Unauthorized to accept this reschedule request');
    }

    // Check if the user is the one who should accept (not the one who requested)
    if (rescheduleInfo.requestedBy === 'learner' && !isProvider) {
      throw new ForbiddenError('Only the provider can accept a learner-initiated reschedule request');
    }

    if (rescheduleInfo.requestedBy === 'provider' && !isLearner) {
      throw new ForbiddenError('Only the learner can accept a provider-initiated reschedule request');
    }

    // 5. Update booking with new date/time and set status to confirmed
    // Note: Repository method handles overlap detection transactionally
    await this.bookingRepository.acceptReschedule(
      request.bookingId,
      rescheduleInfo.newDate,
      rescheduleInfo.newTime
    );

    // TODO: Send notification to the requester about accepted reschedule
  }
}
