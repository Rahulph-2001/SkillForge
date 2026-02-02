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

    // --- Project Management Methods ---

    async listProjects(page: number = 1, limit: number = 20, search?: string, status?: string, category?: string): Promise<AdminProjectsResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            if (category) params.append('category', category);

            const response = await api.get(`${this.baseUrl}/projects?${params.toString()}`);
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to list projects:', error);
            throw error;
        }
    }

    async getProjectStats(): Promise<AdminProjectStats> {
        try {
            const response = await api.get(`${this.baseUrl}/projects/stats`);
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to get project stats:', error);
            throw error;
        }
    }

    async getPendingPaymentRequests(): Promise<PendingPaymentRequest[]> {
        try {
            const response = await api.get(`${this.baseUrl}/payment-requests/pending`);
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to get pending payment requests:', error);
            throw error;
        }
    }

    async processPaymentRequest(requestId: string, approved: boolean, notes?: string, overrideAction?: 'OVERRIDE_RELEASE'): Promise<void> {
        try {
            await api.post(`${this.baseUrl}/payment-requests/${requestId}/process`, {
                approved,
                notes,
                overrideAction
            });
        } catch (error: any) {
            console.error('Failed to process payment request:', error);
            throw error;
        }
    }

    // --- Report Management Methods ---

    async listReports(page: number = 1, limit: number = 10, filters?: ReportFilters): Promise<ListReportsResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (filters?.status) params.append('status', filters.status);
            if (filters?.type) params.append('type', filters.type);
            if (filters?.projectId) params.append('projectId', filters.projectId);

            const response = await api.get(`${this.baseUrl}/reports?${params.toString()}`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to list reports:', error);
            throw error;
        }
    }

    async updateReport(reportId: string, action: 'RESOLVE' | 'DISMISS' | 'REVIEW', resolution?: string): Promise<void> {
        try {
            await api.patch(`${this.baseUrl}/reports/${reportId}/resolution`, {
                action,
                resolution
            });
        } catch (error: any) {
            console.error('Failed to update report:', error);
            throw error;
        }
    }
}

// Project Management Types
export interface AdminProject {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    budget: number;
    duration: string;
    deadline: string | null;
    status: string;
    applicationsCount: number;
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    };
    contributor: {
        id: string;
        name: string;
        avatarUrl: string | null;
    } | null;
    hasPendingPaymentRequest: boolean;
}

export interface AdminProjectsResponse {
    projects: AdminProject[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AdminProjectStats {
    totalProjects: number;
    openProjects: number;
    inProgressProjects: number;
    completedProjects: number;
    pendingApprovalProjects: number;
    cancelledProjects: number;
    totalBudget: number;
}

export interface PendingPaymentRequest {
    id: string;
    projectId: string;
    projectTitle: string;
    type: 'RELEASE' | 'REFUND';
    amount: number;
    requestedBy: {
        id: string;
        name: string;
        email: string;
    };
    recipientId: string;
    status: 'PENDING';
    createdAt: string;
    requesterNotes?: string;
}

export interface Report {
    id: string;
    reporterId: string;
    type: 'USER_REPORT' | 'PROJECT_DISPUTE' | 'COMMUNITY_CONTENT';
    category: string;
    description: string;
    status: 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
    targetUserId?: string;
    projectId?: string;
    resolution?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
    reporter: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    project?: {
        id: string;
        title: string;
    };
}

export interface ReportFilters {
    status?: string;
    type?: string;
    projectId?: string;
}

export interface ListReportsResponse {
    reports: Report[];
    total: number;
}

export default new AdminService();
