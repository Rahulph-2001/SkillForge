import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus } from '../../../domain/entities/Booking';
import { Database } from '../Database';
export declare class BookingRepository implements IBookingRepository {
    private prisma;
    constructor(db: Database);
    private mapToDomain;
    findById(bookingId: string): Promise<Booking | null>;
    findByProviderId(providerId: string): Promise<Booking[]>;
    findByLearnerId(learnerId: string): Promise<Booking[]>;
    findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]>;
    findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]>;
    findOverlapping(providerId: string, date: Date, startTime: string, endTime: string): Promise<Booking[]>;
    findInDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Booking[]>;
    /**
     * Find overlapping bookings including buffer time
     */
    findOverlappingWithBuffer(providerId: string, date: Date, startTime: string, endTime: string, bufferMinutes: number): Promise<Booking[]>;
    /**
     * Count active bookings for a provider on a specific date
     */
    countActiveBookingsByProviderAndDate(providerId: string, dateString: string): Promise<number>;
    /**
     * Find duplicate booking (idempotency check)
     */
    findDuplicateBooking(learnerId: string, skillId: string, preferredDate: string, preferredTime: string): Promise<Booking | null>;
    createTransactional(booking: Booking, sessionCost: number): Promise<Booking>;
    confirmTransactional(bookingId: string): Promise<Booking>;
    cancelTransactional(bookingId: string, cancelledBy: string, reason: string): Promise<Booking>;
    create(booking: Booking): Promise<Booking>;
    updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking>;
    updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking>;
    cancel(bookingId: string, cancelledBy: string, reason: string): Promise<Booking>;
    delete(bookingId: string): Promise<void>;
    getProviderStats(providerId: string): Promise<{
        pending: number;
        confirmed: number;
        reschedule: number;
        completed: number;
        cancelled: number;
    }>;
    acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking>;
    declineReschedule(bookingId: string, reason: string): Promise<Booking>;
}
//# sourceMappingURL=BookingRepository.d.ts.map