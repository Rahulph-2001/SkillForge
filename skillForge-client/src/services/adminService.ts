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
}


export interface ListUsersResponse {
    users: User[];
    total: number;
}


export interface SuspendUserRequest {
    userId: string;
    reason?: string;
}


class AdminService {
    private readonly baseUrl = '/admin';

   
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
}

// Export singleton instance
export default new AdminService();