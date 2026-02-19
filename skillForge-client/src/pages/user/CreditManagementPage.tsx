import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard
} from 'lucide-react';
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaPlus
} from 'react-icons/fa';
import TransactionList from '../../components/credits/TransactionList';
import BuyCreditsModal from '../../components/credits/BuyCreditsModal';
import creditService from '../../services/creditService';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../../store/hooks';

const CreditManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'purchases' | 'earned' | 'spent'>('all');
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        balance: 0,
        earned: 0,
        spent: 0
    });
    const [refreshKey, setRefreshKey] = useState(0); // To trigger re-fetch

    const { user } = useAppSelector((state) => state.auth);

    const fetchCreditData = useCallback(async () => {
        try {
            setLoading(true);

            const data = await creditService.getTransactions({ limit: 1 });
            if (data.stats) {
                setStats({
                    balance: user?.credits || 0, // Use actual user credits from Redux store
                    earned: data.stats.totalEarned,
                    spent: data.stats.totalSpent
                });
            }
        } catch (error) {
            console.error('Failed to fetch credit data', error);
            toast.error('Failed to load credit data');
        } finally {
            setLoading(false);
        }
    }, [user?.credits]);

    useEffect(() => {
        fetchCreditData();
    }, [fetchCreditData, refreshKey]);

    const handlePurchaseSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Credit Management</h1>
                                <p className="text-muted-foreground">Track and manage your platform credits</p>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsBuyModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all"
                    >
                        <FaPlus className="text-sm" />
                        Buy Credits
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Current Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground shadow-lg relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FaWallet className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 opacity-80" />
                            <span className="text-sm opacity-80 font-medium">Available Balance</span>
                        </div>
                        <div className="text-4xl font-bold mb-2">
                            {stats.balance}
                        </div>
                        <p className="text-sm opacity-80">Credits available for use</p>
                    </motion.div>

                    {/* Total Earned Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-6 shadow border border-border text-card-foreground"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <FaArrowUp className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Total Earned</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">
                            {stats.earned} <span className="text-sm font-normal text-muted-foreground">Credits</span>
                        </div>
                        <div className="mt-2 text-xs text-green-500 font-medium">
                            + Lifetime Earnings
                        </div>
                    </motion.div>

                    {/* Total Spent Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-6 shadow border border-border text-card-foreground"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-destructive/10 rounded-lg">
                                <FaArrowDown className="w-5 h-5 text-destructive" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Total Spent</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground mt-2">
                            {stats.spent} <span className="text-sm font-normal text-muted-foreground">Credits</span>
                        </div>
                        <div className="mt-2 text-xs text-destructive font-medium">
                            - Lifetime Spending
                        </div>
                    </motion.div>
                </div>

                {/* Transaction History Section */}
                <div className="bg-card rounded-xl shadow border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-secondary rounded-md">
                                <FaWallet className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-foreground">Transaction History</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">View detailed history of your credit transactions</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border bg-muted/50">
                        {(['all', 'purchases', 'earned', 'spent'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                    ? 'text-primary border-primary bg-primary/5'
                                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        <TransactionList filter={activeTab} key={activeTab} />
                    </div>
                </div>

                <BuyCreditsModal
                    isOpen={isBuyModalOpen}
                    onClose={() => setIsBuyModalOpen(false)}
                    onPurchaseSuccess={handlePurchaseSuccess}
                />
            </div>
        </div>
    );
};

export default CreditManagementPage;
