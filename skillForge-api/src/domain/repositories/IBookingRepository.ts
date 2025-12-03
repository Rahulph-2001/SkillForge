/**
 * Booking Repository Interface
 * Defines contract for booking data access
 * Following Repository Pattern and Dependency Inversion Principle
 */

import { Booking, BookingStatus } from '../entities/Booking';

export interface IBookingRepository {
  /**
   * Find booking by ID
   */
  findById(bookingId: string): Promise<Booking | null>;

  /**
   * Find all bookings for a provider
   */
  findByProviderId(providerId: string): Promise<Booking[]>;

  /**
   * Find all bookings for a learner
   */
  findByLearnerId(learnerId: string): Promise<Booking[]>;

  /**
   * Find bookings by status for a provider
   */
  findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]>;

  /**
   * Find bookings by status for a learner
   */
  findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]>;

  /**
   * Create a new booking
   */
  create(booking: Booking): Promise<Booking>;

  /**
   * Update booking status
   */
  updateStatus(bookingId: string, status: BookingStatus): Promise<Booking>;

  /**
   * Update booking with reschedule info
   */
  updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking>;

  /**
   * Cancel booking with metadata
   */
  cancel(bookingId: string, cancelledBy: string, reason: string): Promise<Booking>;

  /**
   * Delete booking (soft delete)
   */
  delete(bookingId: string): Promise<void>;

  /**
   * Get booking statistics for a provider
   */
  getProviderStats(providerId: string): Promise<{
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  }>;
}
