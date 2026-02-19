import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IValidateSessionTimeUseCase } from './interfaces/IValidateSessionTimeUseCase';
import { ValidateSessionTimeResponseDTO } from '../../dto/videoCall/ValidateSessionTimeDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { BookingStatus } from '../../../domain/entities/Booking';

@injectable()
export class ValidateSessionTimeUseCase implements IValidateSessionTimeUseCase {
  // No early-join restriction — users can join anytime once confirmed
  // Allow joining up to 30 minutes after the session end time (grace period)
  private static readonly GRACE_PERIOD_MINUTES_AFTER = 30;

  constructor(
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository
  ) { }

  async execute(userId: string, bookingId: string): Promise<ValidateSessionTimeResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Verify user is part of this booking
    if (booking.providerId !== userId && booking.learnerId !== userId) {
      throw new ForbiddenError('You are not authorized to join this session');
    }

    // Check booking status - must be confirmed or in_session
    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.IN_SESSION) {
      throw new ValidationError(ERROR_MESSAGES.SESSION.NOT_CONFIRMED);
    }

    // Parse session start and end times
    const sessionStartAt = this.parseDateTime(booking.preferredDate, booking.preferredTime);
    const sessionDurationMinutes = booking.duration || 60;
    const sessionEndAt = new Date(sessionStartAt.getTime() + sessionDurationMinutes * 60 * 1000);

    const now = new Date();

    // Grace period: allow joining up to 30 mins after session end
    const joinWindowEnd = new Date(
      sessionEndAt.getTime() + ValidateSessionTimeUseCase.GRACE_PERIOD_MINUTES_AFTER * 60 * 1000
    );

    // Check if session has expired (past end time + grace period)
    if (now > joinWindowEnd) {
      return {
        canJoin: false,
        message: ERROR_MESSAGES.SESSION.SESSION_EXPIRED,
        sessionStartAt,
        sessionEndAt,
        remainingSeconds: 0,
        sessionDurationMinutes,
      };
    }

    // No early-join restriction — users can join anytime once booking is confirmed

    // Calculate remaining session time
    let remainingSeconds = 0;
    if (now < sessionEndAt) {
      remainingSeconds = Math.floor((sessionEndAt.getTime() - now.getTime()) / 1000);
    }

    return {
      canJoin: true,
      message: 'Session is available to join',
      sessionStartAt,
      sessionEndAt,
      remainingSeconds,
      sessionDurationMinutes,
    };
  }

  private parseDateTime(dateString: string, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}