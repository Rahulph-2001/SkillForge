import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IDeclineBookingUseCase, DeclineBookingRequestDTO } from './interfaces/IDeclineBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

@injectable()
export class DeclineBookingUseCase implements IDeclineBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IEscrowRepository)
    private readonly escrowRepository: IEscrowRepository,
    @inject(TYPES.INotificationService)
    private readonly notificationService: INotificationService,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) { }

  async execute(request: DeclineBookingRequestDTO): Promise<void> {
    // 1. Find the booking
    const booking = await this.bookingRepository.findById(request.bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 2. Verify the provider owns this booking
    if (booking.providerId !== request.providerId) {
      throw new ForbiddenError('Unauthorized: You can only decline your own bookings');
    }

    // 3. Check if booking can be rejected
    if (!booking.canBeRejected()) {
      throw new ValidationError(`Cannot decline booking with status: ${booking.status}`);
    }

    // 4. Refund credits from escrow to learner
    await this.escrowRepository.refundCredits(request.bookingId);

    // 5. Update booking status to rejected
    await this.bookingRepository.updateStatus(
      request.bookingId,
      BookingStatus.REJECTED,
      request.reason
    );

    // 6. Send notification to learner
    const provider = await this.userRepository.findById(booking.providerId);

    await this.notificationService.send({
      userId: booking.learnerId,
      type: NotificationType.SESSION_DECLINED,
      title: 'Session Declined',
      message: `${provider?.name || 'Provider'} declined your session request${request.reason ? `. Reason: ${request.reason}` : ''}`,
      data: { bookingId: booking.id, providerId: booking.providerId },
    });
  }
}