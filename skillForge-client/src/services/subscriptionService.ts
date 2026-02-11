import api from './api';


export interface SubscriptionFeature {
    id: string;
    name: string;
    description?: string;
    featureType: 'BOOLEAN' | 'NUMERIC_LIMIT' | 'TEXT';
    limitValue?: number;
    isEnabled: boolean;
    displayOrder: number;
    isHighlighted: boolean;
}


export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    projectPosts: number | null;
    createCommunity: number | null;
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

export interface ListPlansResponse {
    plans: SubscriptionPlan[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}


export interface CreatePlanRequest {
    name: string;
    price: number;
    projectPosts: number | null;
    createCommunity: number | null;
    features?: Partial<SubscriptionFeature>[]; // Rich features array
    badge: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    color: string;
    description?: string;
    currency?: string;
    billingInterval?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME';
    trialDays?: number;
    isPopular?: boolean;
    displayOrder?: number;
    isPublic?: boolean;
}

export interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
    planId: string;
    isActive?: boolean;
}


class SubscriptionService {
    private readonly baseUrl = '/admin/subscriptions';
    private readonly publicBaseUrl = '/subscriptions';


 async listPlans(page: number = 1, limit: number = 20, isActive?: boolean): Promise<ListPlansResponse> {
    try {
        const params: Record<string, string> = {
            page: page.toString(),
            limit: limit.toString(),
        };
        if (isActive !== undefined) {
            params.isActive = isActive.toString();
        }

        const response = await api.get(`${this.baseUrl}/plans`, { params });

        if (response.data?.success && response.data?.data) {
            return response.data.data;
        }

        if (response.data?.plans) {
            return response.data;
        }

        console.error('[SubscriptionService] Invalid response structure:', response.data);
        throw new Error('Invalid response structure from server');
    } catch (error: any) {
        console.error('[SubscriptionService] Error loading plans:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            url: error?.config?.url
        });

        const errorMessage = error?.response?.data?.message
            || error?.response?.data?.error?.message
            || error?.message
            || 'Failed to load subscription plans';

        throw new Error(errorMessage);
    }
}

    async getStats(): Promise<SubscriptionStats> {
        try {
            const response = await api.get(`${this.baseUrl}/stats`);

            // Backend returns: { success: true, message: string, data: SubscriptionStats }
            if (response.data?.success && response.data?.data) {
                return response.data.data;
            }

            // Fallback
            if (response.data?.totalRevenue !== undefined) {
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
            const response = await api.post(`${this.baseUrl}/plans`, plan);

            // Backend returns: { success: true, message: string, data: SubscriptionPlan }
            if (response.data?.success && response.data?.data) {
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
            const response = await api.put(`${this.baseUrl}/plans/${planId}`, plan);

            // Backend returns: { success: true, message: string, data: SubscriptionPlan }
            if (response.data?.success && response.data?.data) {
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
            const response = await api.delete(`${this.baseUrl}/plans/${planId}`);

            // Backend returns: { success: true, message: string }
            if (response.data?.success) {
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
            const response = await api.get(`${this.publicBaseUrl}/plans`);

            // Handle ResponseBuilder format: { statusCode: 200, body: { success: true, data: {...} } }
            if (response.data?.body?.success && response.data?.body?.data) {
                const result = response.data.body.data;
                return result;
            }

            // Handle direct format: { success: true, data: { plans: [], total: number } }
            if (response.data?.success && response.data?.data) {
                const result = response.data.data;
                return result;
            }

            // Fallback for different response structure: { plans: [], total: number }
            if (response.data?.plans) {
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

    /**
     * Get current user's subscription (user-facing)
     */
    async getCurrentSubscription(): Promise<UserSubscription | null> {
        try {
            const response = await api.get(`${this.publicBaseUrl}/me`);

            if (response.data?.success && response.data?.data) {
                return response.data.data;
            }

            // No subscription (free user)
            return null;
        } catch (error: any) {
            console.error('[SubscriptionService] Error getting current subscription:', {
                message: error?.message,
                status: error?.response?.status
            });
            return null;
        }
    }

    /**
     * Cancel current user's subscription
     */
    async cancelSubscription(immediately: boolean = false): Promise<void> {
        try {
            const response = await api.post(`${this.publicBaseUrl}/cancel`, { immediately });

            if (!response.data?.success) {
                throw new Error('Failed to cancel subscription');
            }
        } catch (error: any) {
            console.error('[SubscriptionService] Error cancelling subscription:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });

            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error?.message
                || error?.message
                || 'Failed to cancel subscription';

            throw new Error(errorMessage);
        }
    }
    /**
     * Reactivate (Undo Cancel) current user's subscription
     */
    async reactivateSubscription(): Promise<void> {
        try {
            const response = await api.post(`${this.publicBaseUrl}/reactivate`);

            if (!response.data?.success) {
                throw new Error('Failed to reactivate subscription');
            }
        } catch (error: any) {
            console.error('[SubscriptionService] Error reactivating subscription:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });

            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error?.message
                || error?.message
                || 'Failed to reactivate subscription';

            throw new Error(errorMessage);
        }
    }
}

/**
 * User Subscription Interface
 */
export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    planName?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELED' | 'EXPIRED' | 'TRIALING' | 'PAST_DUE';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAt?: string;
    canceledAt?: string;
    isInTrial: boolean;
    hasExpired: boolean;
    willCancelAtPeriodEnd: boolean;
    daysUntilRenewal?: number;
}

// Export singleton instance
export default new SubscriptionService();
