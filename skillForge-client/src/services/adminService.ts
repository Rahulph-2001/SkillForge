import api from './api';


export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
    isActive: boolean;
    isDeleted: boolean;
    emailVerified: boolean;
    avatarUrl: string | null;
}


export interface ListUsersResponse {
    users: User[];
    total: number;
}


export interface SuspendUserRequest {
    userId: string;
    reason?: string;
}


// Session Management Interfaces
export interface AdminSession {
    id: string;
    skillTitle?: string;
    providerName?: string;
    providerAvatar?: string;
    learnerName?: string;
    learnerAvatar?: string;
    preferredDate: string;
    preferredTime: string;
    duration?: number; // in minutes
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    sessionCost: number;
    createdAt: string;
    updatedAt?: string;
}

export interface ListSessionsResponse {
    data: AdminSession[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SessionStats {
    totalSessions: number;
    completed: number;
    upcoming: number;
    cancelled: number;
}

class AdminService {
    private readonly baseUrl = '/admin';
    // ... users methods ...

    async listUsers(): Promise<ListUsersResponse> {
        try {
            const response = await api.get(`${this.baseUrl}/users`);

            if (response.data?.success && response.data?.data) {
                return response.data.data;
            }

            if (response.data?.users) {
                return response.data;
            }

            throw new Error('Invalid response structure from server');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error?.message
                || error?.message
                || 'Failed to load users';

            throw new Error(errorMessage);
        }
    }


    async suspendUser(userId: string, reason?: string): Promise<{ success: boolean; message: string }> {
        // ... implementation ...
        try {
            const response = await api.post(`${this.baseUrl}/users/suspend`, {
                userId,
                reason
            });

            if (response.data?.success) {
                const message = response.data?.data?.message || response.data?.message || 'User suspended successfully';
                return { success: true, message };
            }

            throw new Error('Invalid response from server');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error?.message
                || error?.message
                || 'Failed to suspend user';

            throw new Error(errorMessage);
        }
    }


    async unsuspendUser(userId: string): Promise<{ success: boolean; message: string }> {
        // ... implementation ...
        try {
            const response = await api.post(`${this.baseUrl}/users/unsuspend`, {
                userId
            });

            if (response.data?.success) {
                const message = response.data?.data?.message || response.data?.message || 'User reactivated successfully';
                return { success: true, message };
            }

            throw new Error('Invalid response from server');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error?.message
                || error?.message
                || 'Failed to unsuspend user';

            throw new Error(errorMessage);
        }
    }

    // --- Session Management Methods ---

    async listSessions(page: number = 1, limit: number = 10, search?: string): Promise<ListSessionsResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('search', search);

            const response = await api.get(`${this.baseUrl}/sessions?${params.toString()}`);
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to list sessions:', error);
            throw error;
        }
    }

    async getSessionStats(): Promise<SessionStats> {
        try {
            const response = await api.get(`${this.baseUrl}/sessions/stats`);
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to get session stats:', error);
            throw error;
        }
    }

    async cancelSession(sessionId: string, reason?: string): Promise<void> {
        try {
            await api.patch(`${this.baseUrl}/sessions/${sessionId}/cancel`, { reason });
        } catch (error: any) {
            throw error;
        }
    }

    async completeSession(sessionId: string): Promise<void> {
        try {
            await api.patch(`${this.baseUrl}/sessions/${sessionId}/complete`);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new AdminService();