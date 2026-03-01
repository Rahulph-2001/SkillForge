
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IGetProviderBookingsUseCase, GetProviderBookingsRequestDTO, GetProviderBookingsResponseDTO } from './interfaces/IGetProviderBookingsUseCase';
import { BookingStatus } from '../../../domain/entities/Booking';

@injectable()
export class GetProviderBookingsUseCase implements IGetProviderBookingsUseCase {
  constructor(
    @inject(TYPES.IBookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) { }

  async execute(request: GetProviderBookingsRequestDTO): Promise<GetProviderBookingsResponseDTO> {
    try {
      // 1. Get bookings based on filter
      let bookings;
      if (request.status) {
        bookings = await this.bookingRepository.findByProviderIdAndStatus(
          request.providerId,
          request.status as BookingStatus
        );
      } else {
        bookings = await this.bookingRepository.findByProviderId(request.providerId);
      }

      // 2. Get statistics
      const stats = await this.bookingRepository.getProviderStats(request.providerId);

      return {
        success: true,
        message: 'Bookings retrieved successfully',
        bookings: bookings.map((b) => b.toObject() as unknown as Record<string, unknown>),
        stats,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: (error as Error).message || 'Failed to retrieve bookings',
      };
    }
  }
}
