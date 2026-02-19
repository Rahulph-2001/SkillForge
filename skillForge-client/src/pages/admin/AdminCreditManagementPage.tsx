import { useState, useEffect } from 'react';
import { Plus, Edit2, Ticket, TrendingUp, CreditCard, Users, Loader2, Ban, CheckCircle } from 'lucide-react';
import { CreatePackageData } from '../../components/admin/credits/CreatePackageModal';
import CreatePackageModal from '../../components/admin/credits/CreatePackageModal';
import EditPackageModal, { EditPackageData } from '../../components/admin/credits/EditPackageModal';
import { adminCreditService, CreditPackage, AdminCreditStats } from '../../services/adminCreditService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function AdminCreditManagementPage() {
    const [activeTab, setActiveTab] = useState<'transactions' | 'packages'>('packages');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);



    // Pagination State for packages
    const [packagePage, setPackagePage] = useState(1);
    const [packageLimit, setPackageLimit] = useState(10);
    const [packageTotalPages, setPackageTotalPages] = useState(1);
    const [packageTotalItems, setPackageTotalItems] = useState(0);

    // State for transactions
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionPage, setTransactionPage] = useState(1);
    const [transactionLimit, setTransactionLimit] = useState(10);
    const [transactionTotalPages, setTransactionTotalPages] = useState(1);
    const [transactionTotalItems, setTransactionTotalItems] = useState(0);

    const [creditStats, setCreditStats] = useState<AdminCreditStats | null>(null);
    const [conversionRate, setConversionRate] = useState<number | ''>('');
    const [minCredits, setMinCredits] = useState<number | ''>('');
    const [maxCredits, setMaxCredits] = useState<number | ''>('');

    const loadPackages = async () => {
        setLoading(true);
        try {
            const response = await adminCreditService.getAllPackages(packagePage, packageLimit);
            setPackages(response.data);
            setPackageTotalPages(response.totalPages);
            setPackageTotalItems(response.total);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
            toast.error('Failed to load credit packages');
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions = async (page = 1) => {
        setLoading(true);
        try {
            const response = await adminCreditService.getTransactions(page, transactionLimit);
            setTransactions(response.transactions || []);
            setTransactionPage(response.page);
            setTransactionTotalPages(response.totalPages);
            setTransactionTotalItems(response.total);
        } catch (error) {
            console.error('Failed to load transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await adminCreditService.getStats();
            setCreditStats(data);
        } catch (error) {
            console.error('Failed to load credit stats:', error);
        }
    };

    const loadRedemptionSettings = async () => {
        try {
            const settings = await adminCreditService.getRedemptionSettings();
            setConversionRate(settings.rate);
            setMinCredits(settings.minCredits);
            setMaxCredits(settings.maxCredits);
        } catch (error) {
            console.error('Failed to load redemption settings:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'packages') {
            loadPackages();
        } else {
            loadTransactions(transactionPage);
        }
        loadStats();
        loadRedemptionSettings();
    }, [activeTab, refreshTrigger, packagePage, packageLimit, transactionPage, transactionLimit]);

    const stats = [
        {
            label: "Total Revenue",
            value: formatCurrency(creditStats?.totalRevenue || 0),
            subtext: "From credit sales",
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            label: "Credits Sold",
            value: creditStats ? creditStats.creditsSold.toLocaleString() : "0",
            subtext: "Total credits purchased",
            icon: Ticket,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            label: "Avg Order Value",
            value: formatCurrency(creditStats?.avgOrderValue || 0),
            subtext: "Per transaction",
            icon: CreditCard,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            label: "Transactions",
            value: creditStats ? creditStats.totalTransactions.toLocaleString() : "0",
            subtext: "Total purchases",
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        }
    ];

    const handleCreatePackage = async (data: CreatePackageData): Promise<void> => {
        try {
            await adminCreditService.createPackage(data);
            toast.success('Credit package created successfully');
            setRefreshTrigger(prev => prev + 1); // Refresh list
        } catch (error: any) {
            console.error('Failed to create package:', error);
            throw new Error(error.response?.data?.message || 'Failed to create package');
        }
    };

    const handleUpdatePackage = async (id: string, data: EditPackageData): Promise<void> => {
        try {
            await adminCreditService.updatePackage(id, data);
            toast.success('Credit package updated successfully');
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            console.error('Failed to update package:', error);
            throw new Error(error.response?.data?.message || 'Failed to update package');
        }
    };

    const handleToggleActive = async (pkg: CreditPackage) => {
        try {
            await adminCreditService.updatePackage(pkg.id, { isActive: !pkg.isActive });
            toast.success(`Package ${pkg.isActive ? 'deactivated' : 'activated'} successfully`);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to update package:', error);
            toast.error('Failed to update package status');
        }
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Credit Management</h1>
                        <p className="text-muted-foreground">Manage credit packages, transactions, and user adjustments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            New Package
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.subtext}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions / Settings */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-bold text-foreground mb-4">Redemption Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Conversion Rate (₹ per Credit)
                            </label>
                            <input
                                type="number"
                                className="w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                placeholder="e.g. 50"
                                value={conversionRate}
                                onChange={(e) => setConversionRate(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Min Redemption Credits
                            </label>
                            <input
                                type="number"
                                className="w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                placeholder="e.g. 10"
                                value={minCredits}
                                onChange={(e) => setMinCredits(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Max Redemption Credits
                            </label>
                            <input
                                type="number"
                                className="w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                placeholder="e.g. 1000"
                                value={maxCredits}
                                onChange={(e) => setMaxCredits(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button
                                onClick={() => {
                                    const rate = Number(conversionRate);
                                    if (rate > 0) {
                                        adminCreditService.updateRedemptionSettings({
                                            rate,
                                            minCredits: minCredits !== '' ? Number(minCredits) : undefined,
                                            maxCredits: maxCredits !== '' ? Number(maxCredits) : undefined
                                        })
                                            .then(() => {
                                                toast.success('Redemption settings updated');
                                                loadRedemptionSettings();
                                            })
                                            .catch(() => toast.error('Failed to update settings'));
                                    } else {
                                        toast.error('Please enter a valid conversion rate');
                                    }
                                }}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium transition-colors"
                            >
                                Update Settings
                            </button>
                            <p className="text-xs text-muted-foreground mt-2">
                                Users will receive ₹{conversionRate || '...'} per credit. Range: {minCredits || 10} - {maxCredits || 1000} credits.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-6 bg-muted p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'transactions'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'packages'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Credit Packages
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'packages' ? (
                    loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center text-muted-foreground">
                            <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No Packages Found</h3>
                            <p className="mb-6">Create your first credit package to get started.</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Package
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {packages.map((pkg) => (
                                    <div key={pkg.id} className={`bg-card rounded-xl border border-border shadow-sm p-6 relative group hover:shadow-md transition-shadow ${!pkg.isActive ? 'opacity-75' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">{pkg.credits} Credits</h3>
                                                <p className="text-xl text-muted-foreground">₹{pkg.price}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingPackage(pkg);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(pkg)}
                                                    className={`p-1.5 transition-colors ${pkg.isActive ? 'text-muted-foreground hover:text-destructive' : 'text-green-500 hover:text-green-600'}`}
                                                    title={pkg.isActive ? "Block / Deactivate" : "Unblock / Activate"}
                                                >
                                                    {pkg.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {pkg.discount > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Discount</span>
                                                    <span className="font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">{pkg.discount}% off</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Status</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${pkg.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                                    }`}
                                                    onClick={() => handleToggleActive(pkg)}
                                                >
                                                    {pkg.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            {pkg.isPopular && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Badge</span>
                                                    <span className="bg-teal-500/10 text-teal-600 px-2 py-1 rounded text-xs font-medium">Popular</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-border flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Purchases</span>
                                            <span className="font-bold text-foreground">{pkg.purchases || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Pagination */}
                            {packageTotalPages > 0 && (
                                <div className="flex justify-center mt-6">
                                    <Pagination
                                        currentPage={packagePage}
                                        totalPages={packageTotalPages}
                                        totalItems={packageTotalItems}
                                        limit={packageLimit}
                                        onPageChange={setPackagePage}
                                        onLimitChange={(newLimit: number) => {
                                            setPackageLimit(newLimit);
                                            setPackagePage(1);
                                        }}
                                        showLimitSelector={true}
                                        showInfo={true}
                                    />
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/40">
                            <h3 className="font-semibold text-foreground">Transaction History</h3>
                            <div className="flex gap-2">
                                {/* Add filters here if needed */}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-muted-foreground">
                                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Credits</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.length > 0 ? (
                                        transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    {tx.user ? (
                                                        <div className="flex items-center gap-3">
                                                            <img src={tx.user.avatar || 'https://via.placeholder.com/32'} alt={tx.user.name} className="w-8 h-8 rounded-full object-cover" />
                                                            <div>
                                                                <div className="font-medium text-foreground">{tx.user.name}</div>
                                                                <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">Unknown User</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-foreground">
                                                    {formatCurrency(Math.abs(tx.amount))}
                                                </td>
                                                <td className="px-6 py-4 text-primary font-medium">
                                                    {tx.metadata?.creditsAdded || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                        {tx.type.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                        tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-destructive/10 text-destructive'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                                    {tx.referenceId || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                                No transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {transactionTotalPages > 1 && (
                            <div className="flex justify-center mt-6 p-4">
                                <Pagination
                                    currentPage={transactionPage}
                                    totalPages={transactionTotalPages}
                                    totalItems={transactionTotalItems}
                                    limit={transactionLimit}
                                    onPageChange={loadTransactions}
                                    onLimitChange={(newLimit: number) => {
                                        setTransactionLimit(newLimit);
                                        loadTransactions(1);
                                    }}
                                    showLimitSelector={true}
                                    showInfo={true}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>

            <CreatePackageModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePackage}
            />

            <EditPackageModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdatePackage}
                packageToEdit={editingPackage}
            />
        </div>
    );
}
