import { useState, useEffect } from 'react';
import { Plus, Edit2, Ticket, TrendingUp, CreditCard, Users, Loader2, Ban, CheckCircle } from 'lucide-react';
import { CreatePackageData } from '../../components/admin/credits/CreatePackageModal';
import CreatePackageModal from '../../components/admin/credits/CreatePackageModal';
import EditPackageModal, { EditPackageData } from '../../components/admin/credits/EditPackageModal';
import { adminCreditService, CreditPackage } from '../../services/adminCreditService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

export default function AdminCreditManagementPage() {
    const [activeTab, setActiveTab] = useState<'transactions' | 'packages'>('packages');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await adminCreditService.getAllPackages(page, limit);
                setPackages(response.data);
                setTotalPages(response.totalPages);
                setTotalItems(response.total);
            } catch (error) {
                console.error('Failed to fetch packages:', error);
                toast.error('Failed to load credit packages');
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'packages') {
            fetchPackages();
        }
    }, [activeTab, refreshTrigger, page, limit]);

    const stats = [
        {
            label: "Total Revenue",
            value: "₹0", // Placeholder for now
            subtext: "From credit sales",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            label: "Credits Sold",
            value: "0", // Placeholder
            subtext: "Total credits purchased",
            icon: Ticket,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Avg Order Value",
            value: "₹0", // Placeholder
            subtext: "Per transaction",
            icon: CreditCard,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            label: "Transactions",
            value: "0", // Placeholder
            subtext: "Total purchases",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
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
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Management</h1>
                        <p className="text-gray-600">Manage credit packages, transactions, and user adjustments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            New Package
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.subtext}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'transactions'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'packages'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Credit Packages
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'packages' ? (
                    loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
                            <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Packages Found</h3>
                            <p className="mb-6">Create your first credit package to get started.</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Package
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {packages.map((pkg) => (
                                    <div key={pkg.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative group hover:shadow-md transition-shadow ${!pkg.isActive ? 'opacity-75' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{pkg.credits} Credits</h3>
                                                <p className="text-xl text-gray-600">₹{pkg.price}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingPackage(pkg);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(pkg)}
                                                    className={`p-1.5 transition-colors ${pkg.isActive ? 'text-gray-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'}`}
                                                    title={pkg.isActive ? "Block / Deactivate" : "Unblock / Activate"}
                                                >
                                                    {pkg.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {pkg.discount > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Discount</span>
                                                    <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">{pkg.discount}% off</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Status</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${pkg.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                    onClick={() => handleToggleActive(pkg)}
                                                >
                                                    {pkg.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            {pkg.isPopular && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Badge</span>
                                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-medium">Popular</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Purchases</span>
                                            <span className="font-bold text-gray-900">{pkg.purchases || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="flex justify-center mt-6">
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
                        </>
                    )
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
                        <p>Transactions table will be implemented here.</p>
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
