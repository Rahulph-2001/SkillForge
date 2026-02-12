import React, { useEffect, useState } from 'react';
import {
    FaArrowDown,
    FaArrowUp,
    FaClock,
    FaCheckCircle,
    FaCreditCard,
    FaExchangeAlt,
    FaTimesCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import creditService, { CreditTransaction } from '../../services/creditService';
import { toast } from 'react-hot-toast';

interface TransactionListProps {
    filter: 'all' | 'purchases' | 'earned' | 'spent';
}

const TransactionList: React.FC<TransactionListProps> = ({ filter }) => {
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                // Map filter to API params
                const typeFilter =
                    filter === 'purchases' ? 'CREDIT_PURCHASE' :
                        filter === 'earned' ? 'PROJECT_EARNING' :
                            filter === 'spent' ? 'SESSION_PAYMENT' : undefined;

                // For 'spent' we might also want to include refunds or other spending types if they exist
                // Ideally backend handles 'spent' category, but for now strict type mapping

                const response = await creditService.getTransactions({
                    type: typeFilter,
                    limit: 50 // Fetch more for the list
                });

                // Client-side filtering if API doesn't support complex filters or distinct 'spent' group logic yet
                let filtered = response.transactions;
                if (filter === 'earned') {
                    filtered = filtered.filter(t => t.amount > 0 && t.type !== 'CREDIT_PURCHASE');
                } else if (filter === 'spent') {
                    filtered = filtered.filter(t => t.amount < 0);
                }

                setTransactions(filtered);
            } catch (error) {
                console.error('Failed to fetch transactions', error);
                toast.error('Failed to load transaction history');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [filter]);

    const getIcon = (type: string, status: string) => {
        if (status === 'PENDING') return <FaClock className="text-yellow-600" />;
        if (status === 'FAILED') return <FaTimesCircle className="text-red-600" />;

        switch (type) {
            case 'CREDIT_PURCHASE': return <FaCreditCard className="text-blue-600" />;
            case 'SESSION_PAYMENT': return <FaArrowDown className="text-red-600" />;
            case 'PROJECT_EARNING': return <FaArrowUp className="text-green-600" />;
            case 'REFUND': return <FaArrowDown className="text-green-600" />;
            default: return <FaExchangeAlt className="text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="w-3 h-3" /> Completed
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FaClock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaTimesCircle className="w-3 h-3" /> Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTransactionAmount = (transaction: CreditTransaction) => {
        // For credit purchases, show the credits added (from metadata), not the money amount
        if (transaction.type === 'CREDIT_PURCHASE' && transaction.metadata?.creditsAdded) {
            return {
                value: transaction.metadata.creditsAdded,
                isPositive: true,
                label: 'Credits'
            };
        }

        // For other transactions, use the amount field
        // Positive amounts are earnings, negative are spending
        return {
            value: Math.abs(transaction.amount),
            isPositive: transaction.amount > 0,
            label: transaction.type === 'CREDIT_PURCHASE' ? 'INR' : 'Credits'
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExchangeAlt className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">No transactions found</p>
                <p className="text-sm text-gray-400">Transactions will appear here once you buy or spend credits</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
                {transactions.map((transaction, index) => {
                    const amountInfo = getTransactionAmount(transaction);

                    return (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        {getIcon(transaction.type, transaction.status)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {transaction.description || 'Transaction'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(transaction.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0 ml-4">
                                    <div className={`font-bold ${amountInfo.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {amountInfo.isPositive ? '+' : '-'}{amountInfo.value}
                                    </div>
                                    <div className="mt-1">
                                        {getStatusBadge(transaction.status)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default TransactionList;
