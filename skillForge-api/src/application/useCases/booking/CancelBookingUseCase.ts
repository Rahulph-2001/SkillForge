

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ICancelBookingUseCase, CancelBookingRequestDTO } from './interfaces/ICancelBookingUseCase';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: CancelBookingRequestDTO): Promise<void> {
      // 1. Get the booking
      const booking = await this.bookingRepository.findById(request.bookingId);

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // 2. Verify authorization (User must be learner or provider)
      if (booking.learnerId !== request.userId && booking.providerId !== request.userId) {
        throw new ForbiddenError('Unauthorized to cancel this booking');
      }

      // 3. Verify booking can be cancelled using domain logic
      if (!booking.canBeCancelled()) {
        throw new ValidationError(`Cannot cancel booking with status: ${booking.status}`);
      }

      // 4. Cancel the booking with metadata
      await this.bookingRepository.cancel(
        request.bookingId,
        request.userId,
        request.reason || 'No reason provided'
      );

      // TODO: Trigger refund logic if payment was made
      // TODO: Send notification to other party
  }
}
