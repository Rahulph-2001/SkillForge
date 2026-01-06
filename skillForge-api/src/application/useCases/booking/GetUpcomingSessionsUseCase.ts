import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetUpcomingSessionsUseCase } from './interfaces/IGetUpcomingSessionsUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';

@injectable()
export class GetUpcomingSessionsUseCase implements IGetUpcomingSessionsUseCase {
  constructor(
    @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper
  ) {}

  async execute(userId: string): Promise<BookingResponseDTO[]> {
    const bookings = await this.bookingRepository.findByLearnerId(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter(b => {
      const date = new Date(b.preferredDate);
      return date >= today && (b.status === 'pending' || b.status === 'confirmed');
    });

    upcoming.sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());

    return this.bookingMapper.toDTOs(upcoming);
  }
}
