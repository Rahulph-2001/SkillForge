import api from './api';

export enum NotificationType {
  SESSION_CONFIRMED = 'SESSION_CONFIRMED',
  SESSION_DECLINED = 'SESSION_DECLINED',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  RESCHEDULE_REQUESTED = 'RESCHEDULE_REQUESTED',
  RESCHEDULE_ACCEPTED = 'RESCHEDULE_ACCEPTED',
  RESCHEDULE_DECLINED = 'RESCHEDULE_DECLINED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CREDITS_EARNED = 'CREDITS_EARNED',
  CREDITS_RECEIVED = 'CREDITS_RECEIVED',
  COMMUNITY_UPDATE = 'COMMUNITY_UPDATE',
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  PROFILE_VERIFIED = 'PROFILE_VERIFIED',
  PROJECT_APPLICATION_RECEIVED = 'PROJECT_APPLICATION_RECEIVED',
  PROJECT_APPLICATION_ACCEPTED = 'PROJECT_APPLICATION_ACCEPTED',
  PROJECT_APPLICATION_REJECTED = 'PROJECT_APPLICATION_REJECTED',
  PROJECT_COMPLETION_REQUESTED = 'PROJECT_COMPLETION_REQUESTED',
  PROJECT_COMPLETION_APPROVED = 'PROJECT_COMPLETION_APPROVED',
  PROJECT_COMPLETION_REJECTED = 'PROJECT_COMPLETION_REJECTED',
  SKILL_APPROVED = 'SKILL_APPROVED',
  SKILL_REJECTED = 'SKILL_REJECTED',
  SKILL_BLOCKED = 'SKILL_BLOCKED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

const notificationService = {
  async getNotifications(filters?: NotificationFilters): Promise<NotificationsResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());

    const response = await api.get(`/notifications?${params.toString()}`);
    return response.data.data;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;