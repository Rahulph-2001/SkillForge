
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { RescheduleInfo } from '../../../domain/entities/Booking';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { BookingValidator } from '../../../shared/validators/BookingValidator';

export interface RescheduleBookingRequest {
  bookingId: string;
  userId: string;
  newDate: string;
  newTime: string;
  reason: string;
}

@injectable()
export class RescheduleBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: RescheduleBookingRequest): Promise<void> {
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

    // 6. Create reschedule info
    const rescheduleInfo: RescheduleInfo = {
      newDate: request.newDate,
      newTime: request.newTime,
      reason: request.reason,
      requestedBy: isLearner ? 'learner' : 'provider',
      requestedAt: new Date(),
    };

    // 7. Update booking with reschedule request
    await this.bookingRepository.updateWithReschedule(request.bookingId, rescheduleInfo);

    // TODO: Send notification to the other party (learner or provider)
  }
}
