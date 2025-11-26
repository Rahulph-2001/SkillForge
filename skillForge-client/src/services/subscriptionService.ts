import api from './api';

/**
 * Subscription Feature Interface
 */
export interface SubscriptionFeature {
    id: string;
    name: string;
}


export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    projectPosts: number | null;
    communityPosts: number | null;
    features: SubscriptionFeature[];
    badge: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    color: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Subscription Stats Interface
 */
export interface SubscriptionStats {
    totalRevenue: number;
    monthlyRecurring: number;
    activeSubscriptions: number;
    paidUsers: number;
    freeUsers: number;
}

/**
 * List Plans Response Interface
 */
export interface ListPlansResponse {
    plans: SubscriptionPlan[];
    total: number;
}

/**
 * Create Plan Request Interface
 */
export interface CreatePlanRequest {
    name: string;
    price: number;
    projectPosts: number | null;
    communityPosts: number | null;
    features: Omit<SubscriptionFeature, 'id'>[];
    badge: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    color: string;
}

/**
 * Update Plan Request Interface
 */
export interface UpdatePlanRequest extends CreatePlanRequest {
    planId: string;
}


class SubscriptionService {
    private readonly baseUrl = '/admin/subscriptions';
    private readonly publicBaseUrl = '/subscriptions';

    
    async listPlans(): Promise<ListPlansResponse> {
        try {
            console.log('[SubscriptionService] Fetching subscription plans...');
            const response = await api.get(`${this.baseUrl}/plans`);
            
            console.log('[SubscriptionService] Raw response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: { plans: [], total: number } }
            if (response.data?.success && response.data?.data) {
                const result = response.data.data;
                console.log(`[SubscriptionService] Successfully loaded ${result.plans?.length || 0} plans`);
                return result;
            }
            
            // Fallback for different response structure
            if (response.data?.plans) {
                console.warn('[SubscriptionService] Using fallback response structure');
                return response.data;
            }
            
            // Invalid response structure
            console.error('[SubscriptionService] Invalid response structure:', response.data);
            throw new Error('Invalid response structure from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error loading plans:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                url: error?.config?.url
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to load subscription plans';
            
            throw new Error(errorMessage);
        }
    }

    
    async getStats(): Promise<SubscriptionStats> {
        try {
            console.log('[SubscriptionService] Fetching subscription stats...');
            const response = await api.get(`${this.baseUrl}/stats`);
            
            console.log('[SubscriptionService] Stats response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: SubscriptionStats }
            if (response.data?.success && response.data?.data) {
                console.log('[SubscriptionService] Successfully loaded stats');
                return response.data.data;
            }
            
            // Fallback
            if (response.data?.totalRevenue !== undefined) {
                console.warn('[SubscriptionService] Using fallback stats structure');
                return response.data;
            }
            
            console.error('[SubscriptionService] Invalid stats response:', response.data);
            throw new Error('Invalid response structure from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error loading stats:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });
            
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to load subscription statistics';
            
            throw new Error(errorMessage);
        }
    }

    
    async createPlan(plan: CreatePlanRequest): Promise<SubscriptionPlan> {
        try {
            console.log('[SubscriptionService] Creating plan:', plan);
            
            const response = await api.post(`${this.baseUrl}/plans`, plan);
            
            console.log('[SubscriptionService] Create response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: SubscriptionPlan }
            if (response.data?.success && response.data?.data) {
                console.log('[SubscriptionService] Plan created successfully');
                return response.data.data;
            }
            
            console.error('[SubscriptionService] Invalid create response:', response.data);
            throw new Error('Invalid response from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error creating plan:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });
            
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to create subscription plan';
            
            throw new Error(errorMessage);
        }
    }

    
    async updatePlan(planId: string, plan: CreatePlanRequest): Promise<SubscriptionPlan> {
        try {
            console.log('[SubscriptionService] Updating plan:', { planId, plan });
            
            const response = await api.put(`${this.baseUrl}/plans/${planId}`, plan);
            
            console.log('[SubscriptionService] Update response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string, data: SubscriptionPlan }
            if (response.data?.success && response.data?.data) {
                console.log('[SubscriptionService] Plan updated successfully');
                return response.data.data;
            }
            
            console.error('[SubscriptionService] Invalid update response:', response.data);
            throw new Error('Invalid response from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error updating plan:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });
            
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to update subscription plan';
            
            throw new Error(errorMessage);
        }
    }

    
    async deletePlan(planId: string): Promise<void> {
        try {
            console.log('[SubscriptionService] Deleting plan:', { planId });
            
            const response = await api.delete(`${this.baseUrl}/plans/${planId}`);
            
            console.log('[SubscriptionService] Delete response:', {
                status: response.status,
                data: response.data
            });
            
            // Backend returns: { success: true, message: string }
            if (response.data?.success) {
                console.log('[SubscriptionService] Plan deleted successfully');
                return;
            }
            
            console.error('[SubscriptionService] Invalid delete response:', response.data);
            throw new Error('Invalid response from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error deleting plan:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });
            
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to delete subscription plan';
            
            throw new Error(errorMessage);
        }
    }

    
    async listPublicPlans(): Promise<ListPlansResponse> {
        try {
            console.log('[SubscriptionService] Fetching public subscription plans...');
            const response = await api.get(`${this.publicBaseUrl}/plans`);
            
            console.log('[SubscriptionService] Public plans response:', {
                status: response.status,
                data: response.data
            });
            
            // Handle ResponseBuilder format: { statusCode: 200, body: { success: true, data: {...} } }
            if (response.data?.body?.success && response.data?.body?.data) {
                const result = response.data.body.data;
                console.log(`[SubscriptionService] Successfully loaded ${result.plans?.length || 0} public plans`);
                return result;
            }
            
            // Handle direct format: { success: true, data: { plans: [], total: number } }
            if (response.data?.success && response.data?.data) {
                const result = response.data.data;
                console.log(`[SubscriptionService] Successfully loaded ${result.plans?.length || 0} public plans`);
                return result;
            }
            
            // Fallback for different response structure: { plans: [], total: number }
            if (response.data?.plans) {
                console.warn('[SubscriptionService] Using fallback response structure');
                return response.data;
            }
            
            // Invalid response structure
            console.error('[SubscriptionService] Invalid response structure:', response.data);
            throw new Error('Invalid response structure from server');
        } catch (error: any) {
            console.error('[SubscriptionService] Error loading public plans:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                url: error?.config?.url
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error?.message
                || error?.message 
                || 'Failed to load subscription plans';
            
            throw new Error(errorMessage);
        }
    }
}

// Export singleton instance
export default new SubscriptionService();
