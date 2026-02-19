import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Wallet,
    CreditCard,
    BadgeCheck,
    Download,
    Upload,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Shield,
    ArrowDownLeft,
    ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import walletService, { WalletData, WalletTransaction, WalletTransactionFilters } from '../../services/walletService';

type TabType = 'all' | 'credits' | 'withdrawals' | 'pending';

import RedeemModal from '../../components/wallet/RedeemModal';
import WithdrawalModal from '../../components/wallet/WithdrawalModal';

const WalletPage = () => {
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

    const fetchWalletData = useCallback(async () => {
        try {
            const data = await walletService.getWalletData();
            setWalletData(data);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            toast.error('Failed to load wallet data');
        }
    }, []);

    const fetchTransactions = useCallback(async (filters?: WalletTransactionFilters) => {
        setTransactionsLoading(true);
        try {
            const response = await walletService.getTransactions(filters);
            setTransactions(response.transactions);
            setPagination(response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setTransactionsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchWalletData(), fetchTransactions()]);
            setLoading(false);
        };
        loadData();
    }, [fetchWalletData, fetchTransactions]);

    useEffect(() => {
        const filters: WalletTransactionFilters = { page: 1, limit: 10 };

        if (activeTab === 'credits') {
            filters.type = 'PROJECT_EARNING';
        } else if (activeTab === 'withdrawals') {
            filters.type = 'WITHDRAWAL';
        } else if (activeTab === 'pending') {
            filters.status = 'PENDING';
        }

        fetchTransactions(filters);
    }, [activeTab, fetchTransactions]);

    const handlePageChange = (newPage: number) => {
        const filters: WalletTransactionFilters = { page: newPage, limit: 10 };

        if (activeTab === 'credits') {
            filters.type = 'PROJECT_EARNING';
        } else if (activeTab === 'withdrawals') {
            filters.type = 'WITHDRAWAL';
        } else if (activeTab === 'pending') {
            filters.status = 'PENDING';
        }

        fetchTransactions(filters);
    };

    const handleOperationSuccess = () => {
        fetchWalletData();
        fetchTransactions();
    };

    const getTransactionIcon = (type: WalletTransaction['type'], status: WalletTransaction['status']) => {
        if (status === 'PENDING') {
            return <Clock className="w-5 h-5 text-yellow-600" />;
        }
        if (status === 'FAILED') {
            return <XCircle className="w-5 h-5 text-red-600" />;
        }

        switch (type) {
            case 'PROJECT_EARNING':
            case 'SESSION_EARNING':
            case 'COMMUNITY_EARNING':
            case 'REFUND':
            case 'CREDIT_PURCHASE':
                return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
            case 'WITHDRAWAL':
            case 'SESSION_PAYMENT':
            case 'COMMUNITY_JOIN':
            case 'PROJECT_PAYMENT':
            case 'CREDIT_REDEMPTION':
                return <ArrowUpRight className="w-5 h-5 text-red-600" />;
            default:
                return <CreditCard className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTransactionLabel = (transaction: WalletTransaction) => {
        switch (transaction.type) {
            case 'PROJECT_EARNING':
                return transaction.description || 'Project Payment Received';
            case 'PROJECT_PAYMENT':
                return transaction.description || 'Project Payment';
            case 'SESSION_EARNING':
                return transaction.description || 'Session Earnings';
            case 'SESSION_PAYMENT':
                return transaction.description || 'Session Booking';
            case 'COMMUNITY_JOIN':
                return transaction.description || 'Joined Community';
            case 'COMMUNITY_EARNING':
                return transaction.description || 'Community Membership Fee';
            case 'CREDIT_REDEMPTION':
                return 'Credits Redeemed';
            case 'CREDIT_PURCHASE':
                return 'Credits Purchased';
            case 'WITHDRAWAL':
                return `Withdrawn to ${transaction.metadata?.method || 'Bank Account'}`;
            case 'REFUND':
                return transaction.description || 'Refund Received';
            default:
                return 'Transaction';
        }
    };

    const getStatusBadge = (status: WalletTransaction['status']) => {
        switch (status) {
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" /> Failed
                    </span>
                );
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        // Use the actual sign of the amount from the backend
        // Backend now correctly sets negative amounts for spending/locking credits
        const isPositive = amount > 0;
        const absoluteAmount = Math.abs(amount);
        const prefix = isPositive ? '+' : '-';
        const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

        // Format based on currency
        let formattedAmount = '';
        if (currency === 'CREDITS') {
            formattedAmount = `${prefix}${absoluteAmount} Credits`;
        } else {
            formattedAmount = `${prefix}₹${absoluteAmount.toLocaleString('en-IN')}`;
        }

        return (
            <span className={`font-bold ${colorClass}`}>
                {formattedAmount}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading wallet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 transitions-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
                            <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Wallet Balance Card */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 opacity-80" />
                            <span className="text-sm opacity-80">Wallet Balance</span>
                        </div>
                        <div className="text-3xl font-bold mb-2">
                            ₹{walletData?.walletBalance.toLocaleString('en-IN') || 0}
                        </div>
                        <p className="text-sm opacity-80">Available for withdrawal</p>
                    </div>

                    {/* Credits Card */}
                    <div className="bg-gradient-to-br from-secondary to-secondary/80 border border-border rounded-xl p-6 text-foreground shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 opacity-80" />
                            <span className="text-sm opacity-80">Total Credits</span>
                        </div>
                        <div className="text-3xl font-bold mb-3">
                            {walletData?.credits.total || 0}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="opacity-80">Earned:</span>
                                <span className="font-medium">{walletData?.credits.earned || 0}✓</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Purchased:</span>
                                <span className="font-medium">{walletData?.credits.purchased || 0}✓</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Bonus:</span>
                                <span className="font-medium">{walletData?.credits.bonus || 0}✗</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-80">Redeemable:</span>
                                <span className="font-bold">{walletData?.credits.redeemable || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-card rounded-xl p-6 shadow border border-border text-card-foreground">
                        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsRedeemModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Redeem Credits
                            </button>
                            <button
                                onClick={() => setIsWithdrawalModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Withdraw Money
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            {walletData?.verification.bank_details?.verified ? (
                                <>
                                    <BadgeCheck className="w-4 h-4 text-green-500" />
                                    <span className="text-green-500">KYC Verified</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-500">KYC Pending</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Redemption Policy */}
                <div className="bg-card rounded-xl p-6 shadow border border-border mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">Redemption Policy - Anti-Fraud Measures</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Only <strong>earned</strong> and <strong>purchased</strong> credits can be redeemed (Bonus credits are NOT redeemable)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Minimum redemption: {walletData?.minRedemptionCredits || 10} credits (₹{(walletData?.minRedemptionCredits || 10) * (walletData?.conversionRate || 0)})</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Maximum redemption: {walletData?.maxRedemptionCredits || 1000} credits (₹{(walletData?.maxRedemptionCredits || 1000) * (walletData?.conversionRate || 0)})</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Redemption rate: ₹{walletData?.conversionRate || '...'} per credit</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Minimum withdrawal: ₹500</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-yellow-500/90">Requirements: 2 completed sessions, 7 days account age</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-yellow-500/90">First redemption requires manual approval (24-48 hours)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <span className="text-destructive">KYC required for redemptions above ₹5,000</span>
                        </li>
                    </ul>
                </div>

                {/* Transaction History */}
                <div className="bg-card rounded-xl shadow border border-border">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Transaction History</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">View all your wallet transactions</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        {(['all', 'credits', 'withdrawals', 'pending'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Transactions List */}
                    <div className="divide-y divide-border">
                        {transactionsLoading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                Loading transactions...
                            </div>
                        ) : (transactions?.length || 0) === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                No transactions found
                            </div>
                        ) : (
                            (transactions || []).map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="p-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                                {getTransactionIcon(transaction.type, transaction.status)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {getTransactionLabel(transaction)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="mb-1">
                                                {formatAmount(transaction.amount, transaction.currency)}
                                            </div>
                                            {getStatusBadge(transaction.status)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination?.totalPages > 1 && (
                        <div className="p-4 border-t border-border flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} transactions
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RedeemModal
                isOpen={isRedeemModalOpen}
                onClose={() => setIsRedeemModalOpen(false)}
                onSuccess={handleOperationSuccess}
                maxRedeemableCredits={walletData?.credits?.redeemable || 0}
                conversionRate={walletData?.conversionRate || 0}
                minCredits={walletData?.minRedemptionCredits || 10}
                maxCredits={walletData?.maxRedemptionCredits || 1000}
            />

            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                onSuccess={handleOperationSuccess}
                currentBalance={walletData?.walletBalance || 0}
                bankDetails={walletData?.verification?.bank_details}
            />
        </div>
    );
};

export default WalletPage;


