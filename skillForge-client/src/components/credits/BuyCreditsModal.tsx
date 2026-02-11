import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaCreditCard } from 'react-icons/fa';
import CreditPackageCard from './CreditPackageCard';
// import creditService, { CreditPackageData } from '../../services/creditService';
import { toast } from 'react-hot-toast';

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseSuccess?: () => void;
}

// Mock data (replace with service call)
const MOCK_PACKAGES = [
    { id: '1', credits: 50, price: 500, finalPrice: 500, savings: 0, discount: 0, isPopular: false },
    { id: '2', credits: 200, price: 2000, finalPrice: 1800, savings: 200, discount: 10, isPopular: true },
    { id: '3', credits: 500, price: 5000, finalPrice: 4000, savings: 1000, discount: 20, isPopular: false },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, onPurchaseSuccess }) => {
    const [packages, setPackages] = useState<any[]>([]);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Simulate fetch
            setLoading(true);
            setTimeout(() => {
                setPackages(MOCK_PACKAGES);
                setLoading(false);
            }, 500);
        }
    }, [isOpen]);

    const handlePurchase = async () => {
        if (!selectedPackageId) return;

        try {
            setProcessing(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Credits purchased successfully!');
            onPurchaseSuccess?.();
            onClose();
        } catch (error) {
            toast.error('Failed to purchase credits');
        } finally {
            setProcessing(false);
        }
    };

    const selectedPackage = packages.find(p => p.id === selectedPackageId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buy Credits</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Select a credit package that suits your needs</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="text-center py-12">Loading packages...</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {packages.map((pkg) => (
                                            <CreditPackageCard
                                                key={pkg.id}
                                                {...pkg}
                                                selected={selectedPackageId === pkg.id}
                                                onSelect={setSelectedPackageId}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Payment Section (Simplified) */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <FaCreditCard className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
                                            <p className="text-xs text-gray-500">Transactions are encrypted and secured</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Total Information: <br />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedPackage ? `${selectedPackage.credits} Credits for ₹${selectedPackage.finalPrice}` : 'No package selected'}
                                            </span>
                                        </div>
                                        <button
                                            disabled={!selectedPackage || processing}
                                            onClick={handlePurchase}
                                            className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${!selectedPackage || processing
                                                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
                                                }`}
                                        >
                                            {processing ? (
                                                <>Processing...</>
                                            ) : (
                                                <>
                                                    <FaLock className="text-sm" />
                                                    Pay {selectedPackage ? `₹${selectedPackage.finalPrice}` : ''}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BuyCreditsModal;
