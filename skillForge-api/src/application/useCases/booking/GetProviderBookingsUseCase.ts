/**
 * Get Provider Bookings Use Case
 * Retrieves all bookings for a provider with statistics
 * Following Single Responsibility Principle
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

export interface GetProviderBookingsRequest {
  providerId: string;
  status?: string;
}

export interface GetProviderBookingsResponse {
  success: boolean;
  message: string;
  bookings?: any[];
  stats?: {
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  };
}

@injectable()
export class GetProviderBookingsUseCase {
  constructor(
    @inject(TYPES.BookingRepository)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(request: GetProviderBookingsRequest): Promise<GetProviderBookingsResponse> {
    try {
      console.log('🟡 [GetProviderBookingsUseCase] Executing with request:', request);
      
      // 1. Get bookings based on filter
      let bookings;
      if (request.status) {
        console.log('🟡 [GetProviderBookingsUseCase] Fetching bookings with status filter:', request.status);
        bookings = await this.bookingRepository.findByProviderIdAndStatus(
          request.providerId,
          request.status as any
        );
      } else {
        console.log('🟡 [GetProviderBookingsUseCase] Fetching all bookings for provider:', request.providerId);
        bookings = await this.bookingRepository.findByProviderId(request.providerId);
      }

      console.log('🟡 [GetProviderBookingsUseCase] Found bookings:', bookings.length);
      console.log('🟡 [GetProviderBookingsUseCase] Bookings data:', JSON.stringify(bookings.map(b => b.toObject()), null, 2));

      // 2. Get statistics
      const stats = await this.bookingRepository.getProviderStats(request.providerId);
      console.log('🟡 [GetProviderBookingsUseCase] Stats:', stats);

      return {
        success: true,
        message: 'Bookings retrieved successfully',
        bookings: bookings.map((b) => b.toObject()),
        stats,
      };
    } catch (error: any) {
      console.error('❌ [GetProviderBookingsUseCase] Error:', error);
      console.error('❌ [GetProviderBookingsUseCase] Error stack:', error.stack);
      return {
        success: false,
        message: error.message || 'Failed to retrieve bookings',
      };
    }
  }
}
