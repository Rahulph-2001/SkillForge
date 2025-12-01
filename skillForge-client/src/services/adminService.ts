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
            console.log('[AdminService] Fetching users list...');
            const response = await api.get(`${this.baseUrl}/users`);
            
            console.log('[AdminService] Raw response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: { users: [], total: number } }
            if (response.data?.success && response.data?.data) {
                const result = response.data.data;
                console.log(`[AdminService] Successfully loaded ${result.users?.length || 0} users`);
                return result;
            }
            
            // Fallback for different response structure
            if (response.data?.users) {
                console.warn('[AdminService] Using fallback response structure');
                return response.data;
            }
            
            // Invalid response structure
            console.error('[AdminService] Invalid response structure:', response.data);
            throw new Error('Invalid response structure from server');
        } catch (error: any) {
            console.error('[AdminService] Error loading users:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                url: error?.config?.url
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to load users';
            
            throw new Error(errorMessage);
        }
    }

    
    async suspendUser(userId: string, reason?: string): Promise<{ success: boolean; message: string }> {
        try {
            console.log('[AdminService] Suspending user:', { userId, reason });
            
            const response = await api.post(`${this.baseUrl}/users/suspend`, { 
                userId, 
                reason 
            });
            
            console.log('[AdminService] Suspend response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: { message: string } }
            if (response.data?.success) {
                const message = response.data?.data?.message || response.data?.message || 'User suspended successfully';
                console.log('[AdminService] User suspended successfully');
                return {
                    success: true,
                    message
                };
            }
            
            // Invalid response
            console.error('[AdminService] Invalid suspend response:', response.data);
            throw new Error('Invalid response from server');
        } catch (error: any) {
            console.error('[AdminService] Error suspending user:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                url: error?.config?.url
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to suspend user';
            
            throw new Error(errorMessage);
        }
    }

    
    async unsuspendUser(userId: string): Promise<{ success: boolean; message: string }> {
        try {
            console.log('[AdminService] Unsuspending user:', { userId });
            
            const response = await api.post(`${this.baseUrl}/users/unsuspend`, { 
                userId
            });
            
            console.log('[AdminService] Unsuspend response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: { message: string } }
            if (response.data?.success) {
                const message = response.data?.data?.message || response.data?.message || 'User reactivated successfully';
                console.log('[AdminService] User unsuspended successfully');
                return {
                    success: true,
                    message
                };
            }
            
            // Invalid response
            console.error('[AdminService] Invalid unsuspend response:', response.data);
            throw new Error('Invalid response from server');
        } catch (error: any) {
            console.error('[AdminService] Error unsuspending user:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                url: error?.config?.url
            });
            
            // Re-throw with more context
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