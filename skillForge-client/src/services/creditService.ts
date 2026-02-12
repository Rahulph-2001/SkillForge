import api from './api';

export interface CreditPackageData {
    id: string;
    credits: number;
    price: number;
    finalPrice: number;
    savingsAmount: number;
    discount: number;
    isPopular: boolean;
}

export interface CreditPurchaseResponse {
    transactionId: string;
    creditsAdded: number;
    newBalance: number;
    status: string;
}

export interface CreditTransaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: string;
    metadata?: Record<string, any> | null;
}

export interface CreditTransactionsResponse {
    transactions: CreditTransaction[];
    stats: {
        totalEarned: number;
        totalSpent: number;
        totalPurchased: number;
    };
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreditTransactionFilters {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
}

const creditService = {
    /**
     * Get active credit packages
     */
    async getPackages(): Promise<CreditPackageData[]> {
        const response = await api.get('/credits/packages');
        return response.data.data.packages || response.data.data;
    },

    /**
     * Purchase a credit package
     */
    async purchasePackage(packageId: string, paymentIntentId: string): Promise<CreditPurchaseResponse> {
        const response = await api.post('/credits/purchase', {
            packageId,
            paymentIntentId
        });
        return response.data.data;
    },

    /**
     * Get credit transactions history
     */
    async getTransactions(filters: CreditTransactionFilters = {}): Promise<CreditTransactionsResponse> {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.type) params.append('type', filters.type);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/credits/transactions?${params.toString()}`);
        return response.data.data;
    }
};

export default creditService;
