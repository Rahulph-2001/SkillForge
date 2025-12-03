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
    console.log('📅 [bookingService] Creating booking...');
    console.log('📅 [bookingService] Request data:', JSON.stringify(data, null, 2));
    console.log('📅 [bookingService] API endpoint: /bookings');
    
    try {
      const response = await api.post('/bookings', data);
      console.log('✅ [bookingService] Response status:', response.status);
      console.log('✅ [bookingService] Response data:', JSON.stringify(response.data, null, 2));
      console.log('✅ [bookingService] Booking created successfully');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ [bookingService] Booking creation failed');
      console.error('❌ [bookingService] Error:', error);
      console.error('❌ [bookingService] Error response:', error.response);
      console.error('❌ [bookingService] Error data:', error.response?.data);
      console.error('❌ [bookingService] Error status:', error.response?.status);
      console.error('❌ [bookingService] Error headers:', error.response?.headers);
      throw error;
    }
  },

  /**
   * Get all bookings for the current user
   */
  async getUserBookings(): Promise<UserBooking[]> {
    console.log('📅 [bookingService] Fetching user bookings');
    const response = await api.get('/bookings/my-bookings');
    console.log('✅ [bookingService] Bookings fetched:', response.data);
    return response.data.data;
  },

  /**
   * Get a specific booking by ID
   */
  async getBookingById(bookingId: string): Promise<BookingResponse> {
    console.log('📅 [bookingService] Fetching booking:', bookingId);
    const response = await api.get(`/bookings/${bookingId}`);
    console.log('✅ [bookingService] Booking fetched:', response.data);
    return response.data.data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    console.log('📅 [bookingService] Cancelling booking:', bookingId);
    await api.patch(`/bookings/${bookingId}/cancel`);
    console.log('✅ [bookingService] Booking cancelled');
  },

  /**
   * Get upcoming sessions for the user
   */
  async getUpcomingSessions(): Promise<UserBooking[]> {
    console.log('📅 [bookingService] Fetching upcoming sessions');
    const response = await api.get('/bookings/upcoming');
    console.log('✅ [bookingService] Upcoming sessions fetched:', response.data);
    return response.data.data;
  },
};
