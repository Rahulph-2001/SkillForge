import api from './api';

export interface CreateBookingRequest {
  skillId: string;
  providerId: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface BookingResponse {
  id: string;
  skillId: string;
  providerId: string;
  learnerId: string;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  sessionCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserBooking {
  id: string;
  skillTitle: string;
  providerName: string;
  providerAvatar: string | null;
  preferredDate: string;
  preferredTime: string;
  status: string;
  sessionCost: number;
  createdAt: string;
}

export const bookingService = {
  /**
   * Create a new booking request
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    const response = await api.post('/bookings', data);
    return response.data.data;
  },

  /**
   * Get all bookings for the current user
   */
  async getUserBookings(): Promise<UserBooking[]> {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data;
  },

  /**
   * Get a specific booking by ID
   */
  async getBookingById(bookingId: string): Promise<BookingResponse> {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data.data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await api.patch(`/bookings/${bookingId}/cancel`);
  },

  /**
   * Get upcoming sessions for the user
   */
  async getUpcomingSessions(): Promise<UserBooking[]> {
    const response = await api.get('/bookings/upcoming');
    return response.data.data;
  },

  /**
   * Get occupied slots for a provider on a specific date (range)
   */
  async getOccupiedSlots(providerId: string, startDate: string, endDate: string): Promise<{ start: string; end: string }[]> {
    const response = await api.get(`/availability/${providerId}/slots`, {
      params: { start: startDate, end: endDate }
    });
    return response.data.data;
  }
};
