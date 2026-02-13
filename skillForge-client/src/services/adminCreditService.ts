import api from './api';

export interface CreditPackage {
    id: string;
    credits: number;
    price: number;
    discount: number;
    isPopular: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    purchases?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CreateCreditPackageData {
    credits: number;
    price: number;
    isPopular: boolean;
    isActive: boolean;
}

export interface UpdateCreditPackageData extends Partial<CreateCreditPackageData> { }

export interface PaginatedTransactionsResponse {
    transactions: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const adminCreditService = {
    getAllPackages: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<CreditPackage>> => {
        const response = await api.get('/admin/credit-packages', {
            params: { page, limit }
        });
        return response.data.data;
    },

    createPackage: async (data: CreateCreditPackageData): Promise<CreditPackage> => {
        const response = await api.post('/admin/credit-packages', data);
        return response.data.data;
    },

    updatePackage: async (id: string, data: UpdateCreditPackageData): Promise<CreditPackage> => {
        const response = await api.put(`/admin/credit-packages/${id}`, data);
        return response.data.data;
    },

    deletePackage: async (id: string): Promise<void> => {
        await api.delete(`/admin/credit-packages/${id}`);
    },

    getTransactions: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedTransactionsResponse> => {
        const response = await api.get('/admin/wallet/credits', {
            params: { page, limit, search }
        });
        return response.data.data;
    },

    getStats: async (): Promise<AdminCreditStats> => {
        const response = await api.get('/admin/wallet/credit-stats');
        return response.data.data;
    },

    getWithdrawalRequests: async (page: number = 1, limit: number = 10, status?: string): Promise<any> => {
        const response = await api.get('/credit-redemption/admin/withdrawals', {
            params: { page, limit, status }
        });
        return response.data.data;
    },

    processWithdrawal: async (requestId: string, action: 'APPROVE' | 'REJECT', adminNote?: string): Promise<any> => {
        const response = await api.post('/credit-redemption/admin/withdrawals/process', {
            requestId,
            action,
            adminNote
        });
        return response.data.data;
    },

    updateRedemptionSettings: async (settings: { rate: number; minCredits?: number; maxCredits?: number }): Promise<any> => {
        const response = await api.put('/credit-redemption/admin/conversion-rate', settings);
        return response.data.data;
    },

    getRedemptionSettings: async (): Promise<{ rate: number; minCredits: number; maxCredits: number }> => {
        const response = await api.get('/credit-redemption/admin/conversion-rate');
        return response.data.data;
    }
};

export interface AdminCreditStats {
    totalRevenue: number;
    creditsSold: number;
    avgOrderValue: number;
    totalTransactions: number;
}