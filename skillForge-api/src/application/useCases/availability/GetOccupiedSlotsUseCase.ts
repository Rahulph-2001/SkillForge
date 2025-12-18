import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';

@injectable()
export class GetOccupiedSlotsUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository
    ) { }

    async execute(providerId: string, startDate: string, endDate: string): Promise<{ start: string; end: string }[]> {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const bookings = await this.bookingRepository.findInDateRange(providerId, start, end);

        return bookings
            .filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
            .map(b => {
                // Fallback if startAt/endAt not migrated for old records (though we should assume new system)
                if (b.startAt && b.endAt) {
                    return {
                        start: b.startAt.toISOString(),
                        end: b.endAt.toISOString()
                    };
                }

                // Fallback logic for old data or if null
                const startTime = new Date(b.preferredDate);
                const [h, m] = b.preferredTime.split(':').map(Number);
                startTime.setHours(h, m, 0, 0);

                const durationMs = (b.duration || 60) * 60 * 1000;
                const endTime = new Date(startTime.getTime() + durationMs);

                return {
                    start: startTime.toISOString(),
                    end: endTime.toISOString()
                };
            });
    }
}
