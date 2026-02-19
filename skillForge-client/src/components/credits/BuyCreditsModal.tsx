import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaCreditCard } from 'react-icons/fa';
import CreditPackageCard from './CreditPackageCard';
import PaymentModal from '../payment/PaymentModal';
import creditService, { CreditPackageData } from '../../services/creditService';
import paymentService from '../../services/paymentService';
import { toast } from 'react-hot-toast';

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseSuccess?: () => void;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, onPurchaseSuccess }) => {
    const [packages, setPackages] = useState<CreditPackageData[]>([]);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [clientSecret, setClientSecret] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            fetchPackages();
        } else {
            // Reset state when modal closes
            setSelectedPackageId(null);
            setShowPaymentModal(false);
            setClientSecret('');
        }
    }, [isOpen]);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await creditService.getPackages();
            setPackages(response);
        } catch (error: any) {
            console.error('Failed to fetch credit packages:', error);
            toast.error(error.response?.data?.message || 'Failed to load credit packages');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPackageId) return;

        const selectedPkg = packages.find(p => p.id === selectedPackageId);
        if (!selectedPkg) return;

        try {
            setProcessing(true);

            // Step 1: Create Payment Intent
            const paymentIntent = await paymentService.createPaymentIntent({
                amount: selectedPkg.finalPrice,
                currency: 'INR',
                purpose: 'CREDITS',
                metadata: {
                    packageId: selectedPkg.id,
                    credits: selectedPkg.credits,
                },
            });

            // Step 2: Store payment data and open Stripe modal
            setClientSecret(paymentIntent.clientSecret);
            setShowPaymentModal(true);

        } catch (error: any) {
            console.error('Failed to initiate payment:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
            setProcessing(false);
        }
    };

    const handlePaymentSuccess = async (stripePaymentIntentId: string) => {
        try {
            // Step 3: Confirm credit purchase with backend
            const result = await creditService.purchasePackage(
                selectedPackageId!,
                stripePaymentIntentId
            );

            toast.success(`Successfully purchased ${result.creditsAdded} credits!`);

            // Close modals and refresh parent
            setShowPaymentModal(false);
            onPurchaseSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Failed to complete credit purchase:', error);
            toast.error(error.response?.data?.message || 'Failed to complete credit purchase');
        } finally {
            setProcessing(false);
        }
    };

    const handlePaymentError = (errorMessage: string) => {
        toast.error(errorMessage);
        setShowPaymentModal(false);
        setProcessing(false);
    };

    const handlePaymentModalClose = () => {
        setShowPaymentModal(false);
        setProcessing(false);
    };

    const selectedPackage = packages.find(p => p.id === selectedPackageId);

    return (
        <>
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
                            <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-border">
                                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">Buy Credits</h2>
                                        <p className="text-muted-foreground text-sm">Select a credit package that suits your needs</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        disabled={processing}
                                        className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                                    >
                                        <FaTimes className="text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Loading packages...</p>
                                        </div>
                                    ) : packages.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground">No credit packages available at the moment.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {packages.map((pkg) => (
                                                <CreditPackageCard
                                                    key={pkg.id}
                                                    id={pkg.id}
                                                    credits={pkg.credits}
                                                    price={pkg.price}
                                                    finalPrice={pkg.finalPrice}
                                                    savings={pkg.savingsAmount}
                                                    discount={pkg.discount}
                                                    isPopular={pkg.isPopular}
                                                    selected={selectedPackageId === pkg.id}
                                                    onSelect={setSelectedPackageId}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Payment Section */}
                                    <div className="bg-muted/40 rounded-xl p-6 border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <FaCreditCard className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">Secure Payment</h3>
                                                <p className="text-xs text-muted-foreground">Powered by Stripe - Your payment is encrypted and secure</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-muted-foreground">
                                                {selectedPackage ? (
                                                    <>
                                                        <span className="font-medium text-foreground block">
                                                            {selectedPackage.credits} Credits
                                                        </span>
                                                        <span className="text-xs">
                                                            {selectedPackage.discount > 0 && (
                                                                <>
                                                                    <span className="line-through mr-2">₹{selectedPackage.price}</span>
                                                                    <span className="text-green-600 font-medium">{selectedPackage.discount}% OFF</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground">No package selected</span>
                                                )}
                                            </div>
                                            <button
                                                disabled={!selectedPackage || processing || loading}
                                                onClick={handlePurchase}
                                                className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${!selectedPackage || processing || loading
                                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
                                                    }`}
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Processing...
                                                    </>
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

            {/* Stripe Payment Modal */}
            {showPaymentModal && clientSecret && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={handlePaymentModalClose}
                    clientSecret={clientSecret}
                    amount={selectedPackage?.finalPrice || 0}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            )}
        </>
    );
};

export default BuyCreditsModal;
