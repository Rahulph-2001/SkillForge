import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IDeclineRescheduleUseCase, DeclineRescheduleRequestDTO } from './interfaces/IDeclineRescheduleUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class DeclineRescheduleUseCase implements IDeclineRescheduleUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.INotificationService)
    private readonly notificationService: INotificationService
  ) { }

  async execute(request: DeclineRescheduleRequestDTO): Promise<void> {
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

    // 6. Send notification to the requester about declined reschedule
    const requesterId = rescheduleInfo.requestedBy === 'learner' ? booking.learnerId : booking.providerId;
    const decliner = await this.userRepository.findById(request.userId);

    await this.notificationService.send({
      userId: requesterId,
      type: NotificationType.RESCHEDULE_DECLINED,
      title: 'Reschedule Declined',
      message: `${decliner?.name || 'User'} declined your reschedule request${request.reason ? `. Reason: ${request.reason}` : '. The session remains at its original time.'}`,
      data: {
        bookingId: booking.id,
        originalDate: booking.preferredDate,
        originalTime: booking.preferredTime
      },
    });
  }
}
