import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus, RescheduleInfo } from '../../../domain/entities/Booking';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class BookingRepository extends BaseRepository<Booking> implements IBookingRepository {
    constructor(db: Database);
    private mapToDomain;
    findById(bookingId: string): Promise<Booking | null>;
    findByProviderId(providerId: string): Promise<Booking[]>;
    findByLearnerId(learnerId: string): Promise<Booking[]>;
    findDuplicateBooking(learnerId: string, skillId: string, preferredDate: string, preferredTime: string): Promise<Booking | null>;
    create(booking: Booking): Promise<Booking>;
    createTransactional(booking: Booking, sessionCost: number): Promise<Booking>;
    cancelTransactional(bookingId: string, _cancelledBy: string, reason: string): Promise<Booking>;
    acceptBooking(bookingId: string): Promise<Booking>;
    declineBooking(bookingId: string, reason: string): Promise<Booking>;
    rescheduleBooking(bookingId: string, rescheduleInfo: RescheduleInfo): Promise<Booking>;
    delete(id: string): Promise<void>;
    findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]>;
    findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]>;
    findOverlapping(providerId: string, date: Date, startTime: string, endTime: string): Promise<Booking[]>;
    findInDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Booking[]>;
    findOverlappingWithBuffer(providerId: string, date: Date, startTime: string, endTime: string, bufferMinutes: number): Promise<Booking[]>;
    countActiveBookingsByProviderAndDate(providerId: string, dateString: string): Promise<number>;
    confirmTransactional(bookingId: string): Promise<Booking>;
    updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking>;
    updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking>;
    acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking>;
    declineReschedule(bookingId: string, _reason: string): Promise<Booking>;
    getProviderStats(providerId: string): Promise<{
        pending: number;
        confirmed: number;
        reschedule: number;
        completed: number;
        cancelled: number;
    }>;
}
//# sourceMappingURL=BookingRepository.d.ts.map