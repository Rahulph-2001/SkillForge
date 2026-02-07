import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RescheduleInfo } from '../../../domain/entities/Booking';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { BookingValidator } from '../../../shared/validators/BookingValidator';
import { DateTimeUtils } from '../../../shared/utils/DateTimeUtils';
import { IRescheduleBookingUseCase, RescheduleBookingRequestDTO } from './interfaces/IRescheduleBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.ISkillRepository)
    private readonly skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.INotificationService)
    private readonly notificationService: INotificationService
  ) { }

  async execute(request: RescheduleBookingRequestDTO): Promise<void> {
    // 1. Validate date and time format
    const formatValidation = BookingValidator.validateDateTimeFormat(
      request.newDate,
      request.newTime
    );
    if (!formatValidation.valid) {
      throw new ValidationError(formatValidation.error || 'Invalid date or time format');
    }

    // 2. Validate new date is in the future
    const newDateTime = new Date(`${request.newDate}T${request.newTime}`);
    if (newDateTime <= new Date()) {
      throw new ValidationError('Reschedule date must be in the future');
    }

    // 3. Get the booking
    const booking = await this.bookingRepository.findById(request.bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 4. Verify authorization (User must be learner or provider)
    const isLearner = booking.learnerId === request.userId;
    const isProvider = booking.providerId === request.userId;

    if (!isLearner && !isProvider) {
      throw new ForbiddenError('Unauthorized to reschedule this booking');
    }

    // 5. Verify booking can be rescheduled
    if (!booking.canBeRescheduled()) {
      throw new ValidationError(`Cannot reschedule booking with status: ${booking.status}`);
    }

    // 5b. Time-based validation: Block rescheduling if session time window has started
    const RESCHEDULE_CUTOFF_MINUTES = 15; // Same as join window
    const sessionStart = this.parseDateTime(booking.preferredDate, booking.preferredTime);
    const rescheduleCutoff = new Date(sessionStart.getTime() - RESCHEDULE_CUTOFF_MINUTES * 60 * 1000);
    const now = new Date();

    if (now >= rescheduleCutoff) {
      throw new ValidationError('Cannot reschedule: Session is about to start or has already started');
    }

    // 6. Get skill to calculate duration
    const skill = await this.skillRepository.findById(booking.skillId);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // 7. Calculate new start and end times
    const [startHours, startMinutes] = request.newTime.split(':').map(Number);
    const newStartAt = new Date(request.newDate);
    newStartAt.setHours(startHours, startMinutes, 0, 0);
    const newEndAt = DateTimeUtils.addHours(newStartAt, skill.durationHours);

    // 8. Create reschedule info with calculated times
    const rescheduleInfo: RescheduleInfo = {
      newDate: request.newDate,
      newTime: request.newTime,
      reason: request.reason,
      requestedBy: isLearner ? 'learner' : 'provider',
      requestedAt: new Date(),
      newStartAt,
      newEndAt,
    };

    // 9. Update booking with reschedule request
    await this.bookingRepository.updateWithReschedule(request.bookingId, rescheduleInfo);

    // 10. Send notification to the other party
    const requester = await this.userRepository.findById(request.userId);
    const recipientId = isLearner ? booking.providerId : booking.learnerId;

    const formattedDate = new Date(request.newDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    await this.notificationService.send({
      userId: recipientId,
      type: NotificationType.RESCHEDULE_REQUESTED,
      title: 'Reschedule Requested',
      message: `${requester?.name || 'User'} requested to reschedule the ${skill.title} session to ${formattedDate} at ${request.newTime}${request.reason ? `. Reason: ${request.reason}` : ''}`,
      data: {
        bookingId: booking.id,
        newDate: request.newDate,
        newTime: request.newTime,
        requestedBy: request.userId,
        skillId: booking.skillId
      },
    });
  }

  private parseDateTime(dateString: string, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
