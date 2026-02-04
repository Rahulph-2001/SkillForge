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
  learnerName?: string; // Optional because it might be a provider session loop
  providerName?: string; // Added for learner sessions
  learnerAvatar?: string | null;
  providerAvatar?: string | null; // Added for learner sessions
  preferredDate: string;
  preferredTime: string;
  duration?: number;
  sessionType?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'reschedule_requested';
  sessionCost: number;
  rescheduleInfo?: RescheduleInfo | null;
  rejectionReason?: string;
  isReviewed?: boolean;
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
    const params = status ? { status } : {};
    const response = await api.get('/sessions/provider', { params });
    return response.data.data;
  },

  /**
   * Accept a booking request
   */
  async acceptBooking(bookingId: string): Promise<void> {
    await api.post(`/sessions/${bookingId}/accept`);
  },

  /**
   * Decline a booking request
   */
  async declineBooking(bookingId: string, reason?: string): Promise<void> {
    await api.post(`/sessions/${bookingId}/decline`, { reason });
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    await api.post(`/sessions/${bookingId}/cancel`, { reason });
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
    // Backend route is defined as router.post('/reschedule/:id', ...) in sessionManagementRoutes.ts
    // This is mounted under /api/v1/sessions
    // So correct path is /sessions/reschedule/:bookingId
    await api.post(`/sessions/reschedule/${bookingId}`, { newDate, newTime, reason });
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
    // Backend route: POST /reschedule/:bookingId/accept (mounted under /sessions)
    // Correct path: /sessions/reschedule/:bookingId/accept
    await api.post(`/sessions/reschedule/${bookingId}/accept`);
  },

  /**
   * Decline a reschedule request
   */
  async declineReschedule(bookingId: string, reason: string): Promise<void> {
    await api.post(`/sessions/${bookingId}/reschedule/decline`, { reason });
  },
};
