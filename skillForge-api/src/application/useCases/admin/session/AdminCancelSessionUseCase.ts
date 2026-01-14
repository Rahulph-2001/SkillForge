import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminCancelSessionUseCase } from './interfaces/IAdminCancelSessionUseCase';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

@injectable()
export class AdminCancelSessionUseCase implements IAdminCancelSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper
    ) { }

    async execute(bookingId: string, reason: string): Promise<BookingResponseDTO> {
        // Admin cancellation
        const booking = await this.bookingRepository.cancelTransactional(bookingId, 'admin', reason);
        return this.bookingMapper.toDTO(booking);
    }
}
