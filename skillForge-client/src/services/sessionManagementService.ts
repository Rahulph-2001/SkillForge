import api from './api';

export interface RescheduleInfo {
  newDate: string;
  newTime: string;
  reason: string;
  requestedBy: 'learner' | 'provider';
  requestedAt: string;
}

export interface ProviderSession {
  id: string;
  skillTitle: string;
  learnerName: string;
  learnerAvatar: string | null;
  preferredDate: string;
  preferredTime: string;
  duration?: number;
  sessionType?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'reschedule_requested';
  sessionCost: number;
  rescheduleInfo?: RescheduleInfo | null;
  createdAt: string;
}

export interface SessionStats {
  pending: number;
  confirmed: number;
  reschedule?: number;
  rescheduleRequested?: number;
  completed: number;
  cancelled?: number;
}

export interface GetSessionsResponse {
  sessions: ProviderSession[];
  stats: SessionStats;
}

export const sessionManagementService = {
  /**
   * Get all sessions for provider with statistics
   */
  async getProviderSessions(status?: string): Promise<GetSessionsResponse> {
    console.log('📅 [sessionManagementService] Fetching provider sessions');
    const params = status ? { status } : {};
    const response = await api.get('/sessions/provider', { params });
    console.log('✅ [sessionManagementService] Sessions fetched:', response.data);
    return response.data.data;
  },

  /**
   * Accept a booking request
   */
  async acceptBooking(bookingId: string): Promise<void> {
    console.log('📅 [sessionManagementService] Accepting booking:', bookingId);
    await api.post(`/sessions/${bookingId}/accept`);
    console.log('✅ [sessionManagementService] Booking accepted');
  },

  /**
   * Decline a booking request
   */
  async declineBooking(bookingId: string, reason?: string): Promise<void> {
    console.log(' [sessionManagementService] Declining booking:', bookingId);
    await api.post(`/sessions/${bookingId}/decline`, { reason });
    console.log(' [sessionManagementService] Booking declined');
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    console.log(' [sessionManagementService] Cancelling booking:', bookingId);
    await api.post(`/sessions/${bookingId}/cancel`, { reason });
    console.log(' [sessionManagementService] Booking cancelled');
  },

  /**
   * Request reschedule for a booking
   */
  async rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTime: string,
    reason: string
  ): Promise<void> {
    console.log(' [sessionManagementService] Requesting reschedule:', bookingId);
    await api.post(`/sessions/${bookingId}/reschedule`, { newDate, newTime, reason });
    console.log(' [sessionManagementService] Reschedule requested');
  },

  /**
   * Get all sessions for user with statistics
   */
  async getUserSessions(status?: string): Promise<GetSessionsResponse> {
    const params = status ? { status } : {};
    const response = await api.get('/bookings/my-bookings', { params });
    // Transform the response to match the expected format
    return {
      sessions: response.data.data || [],
      stats: {
        pending: response.data.data?.filter((s: any) => s.status === 'pending').length || 0,
        confirmed: response.data.data?.filter((s: any) => s.status === 'confirmed').length || 0,
        rescheduleRequested: response.data.data?.filter((s: any) => s.status === 'reschedule requested').length || 0,
        completed: response.data.data?.filter((s: any) => s.status === 'completed').length || 0,
      }
    };
  },

  /**
   * Cancel a session
   */
  async cancelSession(bookingId: string, reason?: string): Promise<void> {
    await api.post(`/sessions/${bookingId}/cancel`, { reason });
  },

  /**
   * Accept a reschedule request
   */
  async acceptReschedule(bookingId: string): Promise<void> {
    console.log('📅 [sessionManagementService] Accepting reschedule:', bookingId);
    await api.post(`/sessions/${bookingId}/reschedule/accept`);
    console.log('✅ [sessionManagementService] Reschedule accepted');
  },

  /**
   * Decline a reschedule request
   */
  async declineReschedule(bookingId: string, reason: string): Promise<void> {
    console.log('📅 [sessionManagementService] Declining reschedule:', bookingId);
    await api.post(`/sessions/${bookingId}/reschedule/decline`, { reason });
    console.log('✅ [sessionManagementService] Reschedule declined');
  },
};
