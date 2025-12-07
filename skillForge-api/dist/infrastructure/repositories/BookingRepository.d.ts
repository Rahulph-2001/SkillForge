import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus } from '../../domain/entities/Booking';
export declare class BookingRepository implements IBookingRepository {
    private prisma;
    constructor();
    private mapToDomain;
    findById(bookingId: string): Promise<Booking | null>;
    findByProviderId(providerId: string): Promise<Booking[]>;
    findByLearnerId(learnerId: string): Promise<Booking[]>;
    findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]>;
    findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]>;
    create(booking: Booking): Promise<Booking>;
    updateStatus(bookingId: string, status: BookingStatus): Promise<Booking>;
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
    declineReschedule(bookingId: string, _reason: string): Promise<Booking>;
}
//# sourceMappingURL=BookingRepository.d.ts.map