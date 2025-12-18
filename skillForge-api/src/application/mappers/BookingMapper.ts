import { injectable } from 'inversify';
import { Booking } from '../../domain/entities/Booking';
import { BookingResponseDTO } from '../dto/booking/BookingResponseDTO';
import { IBookingMapper } from './interfaces/IBookingMapper';

@injectable()
export class BookingMapper implements IBookingMapper {
  toDTO(booking: Booking): BookingResponseDTO {
    // Ensure booking has been persisted (has an ID)
    if (!booking.id) {
      throw new Error('Cannot map booking to DTO: booking has not been persisted');
    }

    // Debug log to check what's being mapped
    if (!booking.providerName) {
      console.log('⚠️ [BookingMapper] Warning: providerName is missing for booking:', booking.id, 'Provider object:', booking.providerName);
    }

    return {
      id: booking.id,
      skillId: booking.skillId,
      skillTitle: booking.skillTitle,
      providerId: booking.providerId,
      providerName: booking.providerName,
      providerAvatar: booking.providerAvatar,
      learnerId: booking.learnerId,
      learnerName: booking.learnerName,
      learnerAvatar: booking.learnerAvatar,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      duration: booking.duration,
      message: booking.message,
      status: booking.status,
      sessionCost: booking.sessionCost,
      rescheduleInfo: booking.rescheduleInfo,
      rejectionReason: booking.rejectionReason,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  toDTOs(bookings: Booking[]): BookingResponseDTO[] {
    return bookings.map(b => this.toDTO(b));
  }
}
