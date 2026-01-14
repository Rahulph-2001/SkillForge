import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminCompleteSessionUseCase } from './interfaces/IAdminCompleteSessionUseCase';
import { BookingStatus } from '../../../../domain/entities/Booking';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

@injectable()
export class AdminCompleteSessionUseCase implements IAdminCompleteSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper
    ) { }

    async execute(bookingId: string): Promise<BookingResponseDTO> {
        const COMPLETED_STATUS = BookingStatus.COMPLETED;
        const booking = await this.bookingRepository.updateStatus(bookingId, COMPLETED_STATUS);
        return this.bookingMapper.toDTO(booking);
    }
}
