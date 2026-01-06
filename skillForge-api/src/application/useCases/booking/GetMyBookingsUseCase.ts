import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetMyBookingsUseCase } from './interfaces/IGetMyBookingsUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';


@injectable()
export class GetMyBookingsUseCase implements IGetMyBookingsUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper
    ) {}

    async execute(userId: string): Promise<BookingResponseDTO[]> {
        const bookings = await this.bookingRepository.findByLearnerId(userId);
        return this.bookingMapper.toDTOs(bookings);
    }
}