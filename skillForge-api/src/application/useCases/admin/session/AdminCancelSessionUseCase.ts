import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminCancelSessionUseCase } from './interfaces/IAdminCancelSessionUseCase';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
import { BookingStatus } from '../../../../domain/entities/Booking';

@injectable()
export class AdminCancelSessionUseCase implements IAdminCancelSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IEscrowRepository) private escrowRepository: IEscrowRepository,
        @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper
    ) { }

    async execute(bookingId: string, reason: string): Promise<BookingResponseDTO> {
        // Admin cancellation - process refund via escrow
        try {
            await this.escrowRepository.refundCredits(bookingId);
        } catch (error) {
            // Log error or handle specific cases (e.g. if already refunded or no escrow)
            // For now, allow proceeding to update status if refund fails (e.g. legacy booking)
            // But usually we should propagate unless we want to force status update.
            // Given "Strict Architecture", we should probably propagate error if escrow is expected.
            // However, to be robust for legacy, we can check error type.
            // Let's assume we propagate for now to ensure data consistency.
            throw error;
        }

        const booking = await this.bookingRepository.updateStatus(bookingId, BookingStatus.CANCELLED, reason);
        return this.bookingMapper.toDTO(booking);
    }
}
