import api from './api';

// Types for wallet data
export interface WalletData {
    walletBalance: number;
    credits: {
        total: number;
        earned: number;
        purchased: number;
        bonus: number;
        redeemable: number;
    };
    verification: {
        email_verified: boolean;
        bank_verified: boolean;
    };
}

export interface WalletTransaction {
    id: string;
    userId: string;
    type: 'PROJECT_EARNING' | 'SESSION_EARNING' | 'SESSION_PAYMENT' | 'CREDIT_REDEMPTION' | 'WITHDRAWAL' | 'REFUND' | 'COMMUNITY_JOIN' | 'COMMUNITY_EARNING' | 'PROJECT_PAYMENT' | 'CREDIT_PURCHASE';
    amount: number;
    currency: string;
    source: string;
    referenceId?: string | null;
    description?: string | null;
    metadata?: Record<string, any> | null;
    previousBalance: number;
    newBalance: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: string;
}

export interface WalletTransactionsResponse {
    transactions: WalletTransaction[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface WalletTransactionFilters {
    type?: 'PROJECT_EARNING' | 'CREDIT_REDEMPTION' | 'WITHDRAWAL' | 'REFUND' | 'COMMUNITY_JOIN' | 'COMMUNITY_EARNING' | 'PROJECT_PAYMENT' | 'CREDIT_PURCHASE' | 'SESSION_PAYMENT' | 'SESSION_EARNING';
    status?: 'COMPLETED' | 'PENDING' | 'FAILED';
    page?: number;
    limit?: number;
}

// Wallet service methods
const walletService = {
    /**
     * Get wallet overview data (balance, credits breakdown, verification status)
     */
    async getWalletData(): Promise<WalletData> {
        const response = await api.get('/wallet');
        return response.data.data;
    },

    /**
     * Get paginated wallet transactions
     */
    async getTransactions(filters?: WalletTransactionFilters): Promise<WalletTransactionsResponse> {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/wallet/transactions?${params.toString()}`);
        return response.data.data;
    },
};

export default walletService;
