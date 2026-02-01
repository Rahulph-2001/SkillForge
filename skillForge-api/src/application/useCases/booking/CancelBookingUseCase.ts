

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { ICancelBookingUseCase } from './interfaces/ICancelBookingUseCase';
import { CancelBookingRequestDTO } from '../../dto/booking/CancelBookingRequestDTO';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  // Users can cancel up to 15 minutes before session starts (same as join window)
  private static readonly CANCEL_CUTOFF_MINUTES = 15;

  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository
  ) { }

  async execute(request: CancelBookingRequestDTO): Promise<void> {
    const { bookingId, userId, reason } = request;

    // 1. Fetch Booking
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    // 2. Authorization Check
    if (booking.learnerId !== userId && booking.providerId !== userId) {
      throw new ForbiddenError('You are not authorized to cancel this booking');
    }

    // 3. Status Validation
    if (!booking.canBeCancelled()) {
      throw new ValidationError('Booking cannot be cancelled in its current state');
    }

    // 4. Time-based validation: Block cancellation if session time window has started
    if (booking.status === BookingStatus.CONFIRMED) {
      const sessionStart = this.parseDateTime(booking.preferredDate, booking.preferredTime);
      const cancelCutoff = new Date(sessionStart.getTime() - CancelBookingUseCase.CANCEL_CUTOFF_MINUTES * 60 * 1000);
      const now = new Date();

      if (now >= cancelCutoff) {
        throw new ValidationError('Cannot cancel: Session is about to start or has already started');
      }
    }

    // 5. Refund credits from escrow to learner
    await this.escrowRepository.refundCredits(bookingId);

    // 6. Update booking status to cancelled
    await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CANCELLED,
      reason || 'Cancelled by user'
    );
  }

  private parseDateTime(dateString: string, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}