import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { SessionInfoDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IGetSessionInfoUseCase } from './interfaces/IGetSessionInfoUseCase';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetSessionInfoUseCase implements IGetSessionInfoUseCase {
  constructor(@inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository) { }

  async execute(bookingId: string): Promise<SessionInfoDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    return {
      providerId: booking.providerId,
      skillTitle: booking.skillTitle || 'Video Session',
      providerName: booking.providerName || 'Provider',
      providerAvatar: booking.providerAvatar || null,
      learnerName: booking.learnerName || 'Learner',
      learnerAvatar: booking.learnerAvatar || null,
      scheduledAt: this.parseDateTime(booking.preferredDate, booking.preferredTime),
      duration: booking.duration || 60,
    };
  }

  private parseDateTime(dateString: string, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}