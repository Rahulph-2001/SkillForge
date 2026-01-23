import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { SessionInfoDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IGetSessionInfoUseCase } from './interfaces/IGetSessionInfoUseCase';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetSessionInfoUseCase implements IGetSessionInfoUseCase {
  constructor(@inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository) {}

  async execute(bookingId: string): Promise<SessionInfoDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    return {
      skillTitle: booking.skillTitle || 'Video Session',
      providerName: booking.providerName || 'Provider',
      providerAvatar: booking.providerAvatar || null,
      learnerName: booking.learnerName || 'Learner',
      learnerAvatar: booking.learnerAvatar || null,
    };
  }
}