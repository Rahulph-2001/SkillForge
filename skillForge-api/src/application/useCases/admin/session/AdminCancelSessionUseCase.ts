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
        // Process refund via escrow before cancelling (will throw if fails)
        await this.escrowRepository.refundCredits(bookingId);

        const booking = await this.bookingRepository.updateStatus(bookingId, BookingStatus.CANCELLED, reason);
        return this.bookingMapper.toDTO(booking);
    }
}
