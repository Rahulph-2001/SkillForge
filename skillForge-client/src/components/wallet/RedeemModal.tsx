import React, { useState } from 'react';
import { AlertCircle, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import walletService from '../../services/walletService';

interface RedeemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    maxRedeemableCredits: number;
    conversionRate: number; // e.g., 50 (₹50 per credit)
    minCredits: number;
    maxCredits: number;
}

const RedeemModal: React.FC<RedeemModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    maxRedeemableCredits,
    conversionRate,
    minCredits,
    maxCredits
}) => {
    const [creditsToRedeem, setCreditsToRedeem] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    if (conversionRate <= 0) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertCircle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Redemption Unavailable
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Credit redemption is currently unavailable as the conversion rate has not been set by the administrator. Please try again later.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const credits = Number(creditsToRedeem) || 0;
    const amountInRupees = credits * conversionRate;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (credits <= 0) {
            setError('Please enter a valid amount of credits.');
            return;
        }

        if (credits > maxRedeemableCredits) {
            setError(`You only have ${maxRedeemableCredits} redeemable credits.`);
            return;
        }

        if (credits < minCredits) {
            setError(`Minimum redemption is ${minCredits} credits.`);
            return;
        }

        if (credits > maxCredits) {
            setError(`Maximum redemption is ${maxCredits} credits.`);
            return;
        }

        setLoading(true);
        try {
            await walletService.redeemCredits(credits);
            toast.success('Credits redeemed successfully!');
            onSuccess();
            onClose();
            setCreditsToRedeem('');
        } catch (err: any) {
            console.error('Redemption error:', err);
            setError(err.response?.data?.message || 'Failed to redeem credits. Please try again.');
            toast.error(err.response?.data?.message || 'Redemption failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Wallet className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Redeem Credits
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Convert your earned credits into wallet balance.
                                        Current Rate: <span className="font-bold text-gray-700">₹{conversionRate} / Credit</span>
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                                                Credits to Redeem
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    name="credits"
                                                    id="credits"
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    placeholder="0"
                                                    value={creditsToRedeem}
                                                    onChange={(e) => setCreditsToRedeem(e.target.value)}
                                                    min={minCredits}
                                                    max={Math.min(maxRedeemableCredits, maxCredits)}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">Credits</span>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Available: {maxRedeemableCredits} credits
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">You will receive:</span>
                                                <span className="font-bold text-gray-900">₹{amountInRupees.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="rounded-md bg-red-50 p-3">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            {error}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || credits <= 0 || credits > maxRedeemableCredits}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Redeem Now'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedeemModal;
