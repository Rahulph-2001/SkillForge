import { Booking, BookingStatus } from '../entities/Booking';

export interface IBookingRepository {
  // Read Operations
  findById(bookingId: string): Promise<Booking | null>;
  findByProviderId(providerId: string): Promise<Booking[]>;
  findByLearnerId(learnerId: string): Promise<Booking[]>;
  findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]>;
  findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]>;

  // Availability & Overlap Checks
  findOverlapping(providerId: string, date: Date, startTime: string, endTime: string): Promise<Booking[]>;
  findInDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Booking[]>;

  // Production-Level Validation Methods
  findOverlappingWithBuffer(
    providerId: string,
    date: Date,
    startTime: string,
    endTime: string,
    bufferMinutes: number
  ): Promise<Booking[]>;
  countActiveBookingsByProviderAndDate(providerId: string, dateString: string): Promise<number>;
  findDuplicateBooking(
    learnerId: string,
    skillId: string,
    preferredDate: string,
    preferredTime: string
  ): Promise<Booking | null>;

  // Transactional Operations (Industrial Level)
  createTransactional(booking: Booking, sessionCost: number): Promise<Booking>;
  confirmTransactional(bookingId: string): Promise<Booking>;
  cancelTransactional(bookingId: string, cancelledBy: string, reason: string): Promise<Booking>;

  // Standard CRUD
  create(booking: Booking): Promise<Booking>;
  updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking>;
  delete(bookingId: string): Promise<void>;

  // Rescheduling Logic
  updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking>;
  acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking>;
  declineReschedule(bookingId: string, reason: string): Promise<Booking>;

  // Analytics
  getProviderStats(providerId: string): Promise<{
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  }>;

  // Admin Operations
  listAll(page: number, limit: number, search?: string): Promise<{ data: Booking[]; total: number }>;
  getGlobalStats(): Promise<{
    totalSessions: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  }>;
}