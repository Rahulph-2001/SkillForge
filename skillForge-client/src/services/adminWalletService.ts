
import api from './api';

export interface WalletStats {
    platformWalletBalance: number;
    totalUsers: number;
    creditsRedeemed: number;
    creditsRedeemedCount: number;
    creditsRedeemedThisMonth: number;
    pendingWithdrawals: number;
    pendingWithdrawalsCount: number;
    completedWithdrawals: number;
    completedWithdrawalsCount: number;
    completedWithdrawalsThisMonth: number;
    totalInEscrow: number;
    activeProjectsCount: number;
    awaitingApproval: number;
    awaitingApprovalCount: number;
}

export interface WalletTransaction {
    id: string;
    transactionId: string;
    userId: string;
    userName: string;
    userEmail: string;
    type: 'CREDIT' | 'WITHDRAWAL';
    amount: number;
    description: string;
    date: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    metadata?: Record<string, any>;
}

export interface WalletTransactionsResponse {
    transactions: WalletTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class AdminWalletService {
    async getWalletStats(): Promise<WalletStats> {
        const response = await api.get('/admin/wallet/stats');
        return response.data.data;
    }

    async getWalletTransactions(
        page: number = 1,
        limit: number = 20,
        search?: string,
        type?: 'CREDIT' | 'WITHDRAWAL',
        status?: 'COMPLETED' | 'PENDING' | 'FAILED'
    ): Promise<WalletTransactionsResponse> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (type) params.append('type', type);
        if (status) params.append('status', status);

        const response = await api.get(`/admin/wallet/transactions?${params.toString()}`);
        return response.data.data;
    }
}

export default new AdminWalletService();