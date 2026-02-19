
import { useState, useEffect } from 'react';
import adminWalletService, { WalletStats, WalletTransaction } from '../../services/adminWalletService';
import toast from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const Icons = {
    Wallet: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
            <circle cx="19" cy="14" r="2"></circle>
        </svg>
    ),
    TrendingUp: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    ),
    Clock: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    TrendingDown: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
    ),
    Lock: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    ),
    Alert: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    CheckCircle: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    ),
    Download: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
    ),
};

export default function AdminWalletManagement() {
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'CREDIT' | 'WITHDRAWAL' | ''>('');
    const [statusFilter, setStatusFilter] = useState<'COMPLETED' | 'PENDING' | 'FAILED' | ''>('');
    const [activeTab, setActiveTab] = useState('transactions');

    useEffect(() => {
        loadWalletStats();
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [page, limit, search, typeFilter, statusFilter]);

    const loadWalletStats = async () => {
        try {
            setLoading(true);
            const data = await adminWalletService.getWalletStats();
            setStats(data);
        } catch (error: any) {
            console.error('Error loading wallet stats:', error);
            toast.error(error.message || 'Failed to load wallet statistics');
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions = async () => {
        try {
            setTransactionsLoading(true);
            const data = await adminWalletService.getWalletTransactions(
                page,
                limit,
                search || undefined,
                typeFilter || undefined,
                statusFilter || undefined
            );
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
            setTotalItems(data.total);
        } catch (error: any) {
            console.error('Error loading transactions:', error);
            toast.error(error.message || 'Failed to load transactions');
        } finally {
            setTransactionsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/40 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-card rounded-lg p-6 h-32"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Wallet Management</h1>
                    <p className="text-muted-foreground">Manage user wallets, redemptions, and withdrawal requests</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Platform Wallet Balance */}
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.Wallet />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Platform</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.platformWalletBalance)}</h3>
                            <p className="text-teal-100 text-sm">Total Wallet Balance</p>
                            <p className="text-teal-200 text-xs mt-2">{stats.totalUsers} users</p>
                        </div>

                        {/* Credits Redeemed */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.TrendingUp />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">This Month</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.creditsRedeemedThisMonth)}</h3>
                            <p className="text-green-100 text-sm">Credits Redeemed</p>
                            <p className="text-green-200 text-xs mt-2">{stats.creditsRedeemedCount} transactions</p>
                        </div>

                        {/* Pending Withdrawals */}
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.Clock />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Pending</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.pendingWithdrawals)}</h3>
                            <p className="text-yellow-100 text-sm">Pending Withdrawals</p>
                            <p className="text-yellow-200 text-xs mt-2">{stats.pendingWithdrawalsCount} requests</p>
                        </div>

                        {/* Completed Withdrawals */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.TrendingDown />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">This Month</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.completedWithdrawalsThisMonth)}</h3>
                            <p className="text-blue-100 text-sm">Completed Withdrawals</p>
                            <p className="text-blue-200 text-xs mt-2">{stats.completedWithdrawalsCount} transaction</p>
                        </div>

                        {/* Total in Escrow */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.Lock />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Escrow</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.totalInEscrow)}</h3>
                            <p className="text-purple-100 text-sm">Total in Escrow</p>
                            <p className="text-purple-200 text-xs mt-2">{stats.activeProjectsCount} active projects</p>
                        </div>

                        {/* Awaiting Approval */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 rounded-lg p-3">
                                    <Icons.Alert />
                                </div>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{stats.awaitingApprovalCount} Pending</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.awaitingApproval)}</h3>
                            <p className="text-orange-100 text-sm">Awaiting Approval</p>
                            <p className="text-orange-200 text-xs mt-2">Payment release/refund requests</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-card rounded-lg shadow-sm mb-6">
                    <div className="border-b border-border">
                        <nav className="flex -mb-px">
                            {['transactions', 'withdrawals', 'escrow', 'approvals', 'user-wallets'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        }`}
                                >
                                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Transactions Table */}
                {activeTab === 'transactions' && (
                    <div className="bg-card rounded-lg shadow-sm border border-border">
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">All Wallet Transactions</h2>
                                    <p className="text-sm text-muted-foreground mt-1">View all wallet-related transactions</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    <Icons.Download />
                                    <span>Export</span>
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icons.Search />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value as any);
                                        setPage(1);
                                    }}
                                    className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                >
                                    <option value="">All Types</option>
                                    <option value="CREDIT">Credit</option>
                                    <option value="WITHDRAWAL">Withdrawal</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value as any);
                                        setPage(1);
                                    }}
                                    className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                >
                                    <option value="">All Status</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {transactionsLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                                Loading transactions...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                                No transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                    {transaction.transactionId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-foreground">{transaction.userName}</div>
                                                    <div className="text-sm text-muted-foreground">{transaction.userEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'CREDIT'
                                                            ? 'bg-green-500/10 text-green-600'
                                                            : 'bg-orange-500/10 text-orange-600'
                                                        }`}>
                                                        {transaction.type === 'CREDIT' ? (
                                                            <Icons.TrendingDown />
                                                        ) : (
                                                            <Icons.TrendingUp />
                                                        )}
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {transaction.type === 'CREDIT' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {transaction.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(transaction.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'COMPLETED'
                                                            ? 'bg-green-500/10 text-green-600'
                                                            : transaction.status === 'PENDING'
                                                                ? 'bg-yellow-500/10 text-yellow-600'
                                                                : 'bg-destructive/10 text-destructive'
                                                        }`}>
                                                        {transaction.status === 'COMPLETED' && <Icons.CheckCircle />}
                                                        {transaction.status === 'PENDING' && <Icons.Clock />}
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="px-6 py-4 border-t border-border">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    limit={limit}
                                    onPageChange={setPage}
                                    onLimitChange={(newLimit: number) => {
                                        setLimit(newLimit);
                                        setPage(1);
                                    }}
                                    showLimitSelector={true}
                                    showInfo={true}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Other tabs placeholder */}
                {activeTab !== 'transactions' && (
                    <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
                        <p className="text-muted-foreground">This section is coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}