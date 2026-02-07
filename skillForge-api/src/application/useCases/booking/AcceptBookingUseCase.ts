
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { NotFoundError, ForbiddenError, ValidationError } from '../../../domain/errors/AppError';
import { IAcceptBookingUseCase, AcceptBookingRequestDTO } from './interfaces/IAcceptBookingUseCase';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotificationType } from '../../../domain/entities/Notification';
import { INotificationService } from '../../../domain/services/INotificationService';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';


@injectable()
export class AcceptBookingUseCase implements IAcceptBookingUseCase {
  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper,
    @inject(TYPES.INotificationService) private readonly notificationService: INotificationService,
    @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,

  ) { }
  async execute(request: AcceptBookingRequestDTO): Promise<BookingResponseDTO> {
    // 1. Find the booking
    const booking = await this.bookingRepository.findById(request.bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    // 2. Verify the provider owns this booking
    if (booking.providerId !== request.providerId) {
      throw new ForbiddenError('Unauthorized: You can only accept your own bookings');
    }
    // 3. Check if booking can be accepted
    if (!booking.canBeAccepted()) {
      throw new ValidationError(`Cannot accept booking with status: ${booking.status}`);
    }
    // 4. Update booking status to confirmed
    // NOTE: Credits remain in escrow - NOT transferred to provider yet
    // Credits will be released when session is marked as completed
    const updatedBooking = await this.bookingRepository.updateStatus(
      request.bookingId,
      BookingStatus.CONFIRMED
    );
     const skill = await this.skillRepository.findById(booking.skillId);
    const provider = await this.userRepository.findById(booking.providerId);
   
    await this.notificationService.send({
      userId: booking.learnerId,
      type: NotificationType.SESSION_CONFIRMED,
      title: 'Session Confirmed',
      message: `Your ${skill?.title || 'skill'} session with ${provider?.name || 'provider'} has been confirmed for ${new Date(booking.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`,
      data: { bookingId: booking.id, skillId: booking.skillId, providerId: booking.providerId },
    });
    return this.bookingMapper.toDTO(updatedBooking);
  }
}
    
 