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
    }
};