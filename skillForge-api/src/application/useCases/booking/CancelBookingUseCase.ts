

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
  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository
  ) {}
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
    // 4. Refund credits from escrow to learner
    await this.escrowRepository.refundCredits(bookingId);
    // 5. Update booking status to cancelled
    await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CANCELLED,
      reason || 'Cancelled by user'
    );
  }
}